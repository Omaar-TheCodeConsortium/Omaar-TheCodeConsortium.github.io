// The Code Consortium forms: receives the contact form and the project brief from the website,
// checks they came from a person, and emails them to the company with a copy to the sender.
// Nothing is stored. Runs on Cloudflare Workers; email goes out through Resend.
//
// POST /contact  multipart form: name, email, topic, message
// POST /brief    multipart form: brief (JSON), pdf (the brief as a PDF), files[] (attachments)
// Both also carry: token (Turnstile), started (ms since the page opened), website (a trap field).

const MB = 1024 * 1024;
const LIMITS = {
  body: 30 * MB, // whole request
  pdf: 6 * MB,
  files: 10,
  filesTotal: 20 * MB, // stays under the email size limit once encoded
  text: 20000,
};
// A real person takes at least this long to fill in each form, in milliseconds.
const MIN_TIME = { contact: 4000, brief: 30000 };
const FILE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

class Refusal extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((entry) => entry.trim()).filter(Boolean);
    const cors = allowed.includes(origin)
      ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
      : {};
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors } });

    if (request.method === 'OPTIONS') return new Response(null, { status: allowed.includes(origin) ? 204 : 403, headers: cors });
    const route = new URL(request.url).pathname.replace(/\/$/, '');
    if (request.method !== 'POST' || !['/contact', '/brief'].includes(route)) return reply(404, { ok: false, error: 'Not found' });

    try {
      if (!allowed.includes(origin)) throw new Refusal(403, 'This form only accepts messages from our website.');
      if (Number(request.headers.get('Content-Length') ?? 0) > LIMITS.body) throw new Refusal(413, 'That is too large to send. Remove some files and try again.');

      const form = await request.formData();
      const ip = request.headers.get('CF-Connecting-IP') ?? '';
      const kind = route.slice(1);
      await screen(form, kind, ip, env);

      const sent = kind === 'contact' ? await contact(form, env) : await brief(form, env);
      return reply(200, { ok: true, ...sent });
    } catch (error) {
      // The trap field is answered as if the message went through, so a bot learns nothing.
      if (error instanceof Refusal && error.status === 200) return reply(200, { ok: true });
      if (error instanceof Refusal) return reply(error.status, { ok: false, error: error.message });
      console.error(error);
      return reply(500, { ok: false, error: 'Something went wrong on our side. Please try again, or email us directly.' });
    }
  },
};

// ---------------------------------------------------------------- Spam checks

async function screen(form, kind, ip, env) {
  // People never see the trap field, so anything in it was filled in by a bot. Pretend it worked.
  if (text(form, 'website', 200)) throw new Refusal(200, 'Sent.');
  const started = Number(form.get('started'));
  if (!Number.isFinite(started) || started < MIN_TIME[kind]) throw new Refusal(429, 'That was quicker than a person can type. Please wait a moment and send it again.');

  // Per connection: a handful of sends a minute is plenty for a person.
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: `${kind}:${ip}` });
    if (!success) throw new Refusal(429, 'Too many messages from this connection. Please wait a minute and try again.');
  }

  const token = text(form, 'token', 4000);
  if (!token) throw new Refusal(400, 'The check that you are a person did not finish. Please try again.');
  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  }).then((response) => response.json());
  if (!check.success) throw new Refusal(403, 'The check that you are a person did not pass. Please reload the page and try again.');
}

// ---------------------------------------------------------------- Contact form

async function contact(form, env) {
  const name = required(form, 'name', 120, 'your name');
  const email = address(form);
  const topic = text(form, 'topic', 80) || 'Something else';
  const message = required(form, 'message', LIMITS.text, 'a message');
  await limitAddress(email, env);

  await send(env, {
    to: [env.TO_EMAIL],
    reply_to: email,
    subject: `Message from the website: ${topic} (${name})`,
    html: page([
      heading('New message from the website'),
      facts([
        ['Name', name],
        ['Email', email],
        ['About', topic],
      ]),
      paragraph(message),
    ]),
  });
  await send(env, {
    to: [email],
    reply_to: env.TO_EMAIL,
    subject: 'We have your message',
    html: page([
      heading(`Thank you, ${name}`),
      paragraph('We have your message and will reply to this address, usually within two working days. Here is a copy of what you sent.'),
      facts([['About', topic]]),
      paragraph(message),
    ]),
  });
  return {};
}

// ---------------------------------------------------------------- Project brief

async function brief(form, env) {
  let data;
  try {
    data = JSON.parse(text(form, 'brief', 200000));
  } catch {
    throw new Refusal(400, 'The brief could not be read. Please try again.');
  }
  const name = clip(data?.contact?.name, 120);
  const email = clip(data?.contact?.email, 200);
  if (!name) throw new Refusal(400, 'Please add your name.');
  if (!EMAIL.test(email)) throw new Refusal(400, 'Please check your email address.');
  await limitAddress(email, env);
  const reference = /^TCC-\d{6}-[A-Z0-9]{4}$/.test(data?.reference) ? data.reference : `TCC-${Date.now().toString(36).toUpperCase()}`;

  const pdf = form.get('pdf');
  if (!(pdf instanceof File) || pdf.size > LIMITS.pdf) throw new Refusal(400, 'The brief document is missing. Please try again.');
  const pdfBytes = new Uint8Array(await pdf.arrayBuffer());
  if (String.fromCharCode(...pdfBytes.slice(0, 5)) !== '%PDF-') throw new Refusal(400, 'The brief document could not be read. Please try again.');

  const files = form.getAll('files').filter((file) => file instanceof File && file.size > 0);
  if (files.length > LIMITS.files) throw new Refusal(413, `Please attach at most ${LIMITS.files} files.`);
  if (files.reduce((sum, file) => sum + file.size, 0) > LIMITS.filesTotal) throw new Refusal(413, 'The files add up to more than 20 MB. Share the large ones as a link instead.');
  for (const file of files) {
    if (!FILE_TYPES.has(file.type)) throw new Refusal(415, `${file.name} is a kind of file we can't accept. Send images, PDFs or office documents.`);
  }

  const briefFile = { filename: `${reference}.pdf`, content: base64(pdfBytes) };
  const attachments = [briefFile, { filename: `${reference}.json`, content: base64(new TextEncoder().encode(JSON.stringify(data, null, 2))) }];
  for (const file of files) attachments.push({ filename: safeName(file.name), content: base64(new Uint8Array(await file.arrayBuffer())) });

  const business = clip(data?.contact?.business, 160);
  const KIND_NAMES = { website: 'website', shop: 'online shop', booking: 'bookings', system: 'business system', app: 'mobile app', other: 'something else' };
  const kinds = Array.isArray(data?.project?.kinds) ? data.project.kinds.map((kind) => KIND_NAMES[kind] ?? clip(kind, 60)).join(', ') : '';
  await send(env, {
    to: [env.TO_EMAIL],
    reply_to: email,
    subject: `Project brief ${reference}: ${business || name}${kinds ? ` (${kinds})` : ''}`,
    html: page([
      heading(`Project brief ${reference}`),
      facts([
        ['From', name],
        ['Business', business || '—'],
        ['Email', email],
        ['Phone', clip(data?.contact?.phone, 60) || '—'],
        ['Wants', kinds || '—'],
        ['Filled in by', data?.contact?.onCall ? `${clip(data?.contact?.takenBy, 80) || 'TCC'}, on a call` : 'The customer'],
      ]),
      paragraph(clip(data?.project?.summary, 4000)),
      paragraph(`The full brief is attached as a PDF, with ${files.length ? `${files.length} file${files.length === 1 ? '' : 's'} they sent` : 'no files'}. The JSON file holds the answers exactly as typed. Reply to this email to reach them.`),
    ]),
    attachments,
  });
  await send(env, {
    to: [email],
    reply_to: env.TO_EMAIL,
    subject: `Your project brief ${reference}`,
    html: page([
      heading(`Thank you, ${name}`),
      paragraph(`We have your project brief, reference ${reference}. A copy is attached. We read every brief and will reply to this address within three working days, either with questions or to arrange a call.`),
      paragraph('If anything changes in the meantime, reply to this email.'),
    ]),
    attachments: [briefFile],
  });
  return { reference };
}

// One address may send a couple of forms a minute, so the copy email can't be used to flood a stranger.
async function limitAddress(email, env) {
  if (!env.LIMITER) return;
  const { success } = await env.LIMITER.limit({ key: `to:${email.toLowerCase()}` });
  if (!success) throw new Refusal(429, 'We have just received a message from this address. Please wait a minute before sending another.');
}

// ---------------------------------------------------------------- Helpers

function text(form, key, max) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
function required(form, key, max, label) {
  const value = text(form, key, max);
  if (!value) throw new Refusal(400, `Please add ${label}.`);
  return value;
}
function address(form) {
  const value = text(form, 'email', 200);
  if (!EMAIL.test(value)) throw new Refusal(400, 'Please check your email address.');
  return value;
}
const clip = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const safeName = (name) => name.replace(/[^\w.\- ()]+/g, '_').slice(-120) || 'file';

function base64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;";
const heading = (value) => `<h1 style="${FONT}font-size:22px;margin:0 0 20px;color:#000">${escape(value)}</h1>`;
const paragraph = (value) => (value ? `<p style="${FONT}font-size:15px;line-height:1.6;margin:0 0 16px;color:#222;white-space:pre-wrap">${escape(value)}</p>` : '');
const facts = (rows) =>
  `<table style="${FONT}font-size:14px;border-collapse:collapse;margin:0 0 20px;width:100%">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;font-family:Menlo,monospace;font-size:11px;text-transform:uppercase;letter-spacing:.1em;vertical-align:top;width:110px">${escape(label)}</td><td style="padding:6px 0;color:#000;border-bottom:1px solid #e5e7eb">${escape(value)}</td></tr>`,
    )
    .join('')}</table>`;
const page = (parts) =>
  `<div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#fff"><p style="font-family:Menlo,monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;margin:0 0 24px;color:#000">The Code Consortium</p>${parts.join('')}<p style="${FONT}font-size:12px;color:#6b7280;margin:32px 0 0;border-top:1px solid #e5e7eb;padding-top:16px">The Code Consortium · thecodeconsortium.com</p></div>`;

async function send(env, message) {
  const email = { from: env.FROM_EMAIL, ...message };
  if (env.DRY_RUN === '1') {
    console.log(JSON.stringify({ dryRun: true, to: email.to, reply_to: email.reply_to, subject: email.subject, attachments: (email.attachments ?? []).map((file) => `${file.filename} (${Math.round((file.content.length * 3) / 4 / 1024)} KB)`) }));
    return;
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(email),
  });
  if (!response.ok) throw new Error(`Resend refused the email: ${response.status} ${await response.text()}`);
}
