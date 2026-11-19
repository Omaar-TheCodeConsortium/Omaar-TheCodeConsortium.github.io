import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { briefSections } from './summary.js';

// The project brief as an A4 PDF in the company's black-and-white style. Made in the browser, so the
// customer can keep a copy, and sent with the brief. Loaded only when needed: pdf-lib is large.

const A4 = [595.28, 841.89];
const MARGIN = 48;
const LABEL_W = 128;
const BLACK = rgb(0, 0, 0);
const GREY = rgb(0.42, 0.45, 0.5);
const RULE = rgb(0.82, 0.84, 0.86);

// Draws an image file onto a canvas and returns it as JPEG bytes, or null if the browser can't read it.
async function asJpeg(source, maxWidth = 900) {
  try {
    const blob = typeof source === 'string' ? await fetch(source).then((response) => response.blob()) : source;
    const bitmap = await createImageBitmap(blob);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const jpeg = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    return new Uint8Array(await jpeg.arrayBuffer());
  } catch {
    return null;
  }
}

export async function briefPdf(brief, files = []) {
  const doc = await PDFDocument.create();
  doc.setTitle(`Project brief ${brief.reference}`);
  doc.setAuthor(brief.contact.name);
  doc.setCreator('The Code Consortium');
  doc.setSubject(brief.contact.business || brief.contact.name);
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  // The standard PDF fonts cover Western European text only; anything else is shown as "?".
  // The exact text is always in the JSON file sent alongside.
  const known = new Map();
  const clean = (value, font = sans) =>
    String(value ?? '')
      .replace(/\r/g, '')
      .replace(/\t/g, '  ')
      .split('')
      .map((ch) => {
        if (ch === '\n') return ch;
        const key = `${font.name}${ch}`;
        if (!known.has(key)) {
          try {
            font.widthOfTextAtSize(ch, 10);
            known.set(key, true);
          } catch {
            known.set(key, false);
          }
        }
        return known.get(key) ? ch : '?';
      })
      .join('');

  const wrap = (value, font, size, width) => {
    const lines = [];
    for (const paragraph of clean(value, font).split('\n')) {
      let line = '';
      for (const word of paragraph.split(/ +/)) {
        const attempt = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(attempt, size) <= width) {
          line = attempt;
          continue;
        }
        if (line) lines.push(line);
        // A single word wider than the line, such as a long link, is broken by character.
        let rest = word;
        while (font.widthOfTextAtSize(rest, size) > width) {
          let cut = rest.length - 1;
          while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > width) cut -= 1;
          lines.push(rest.slice(0, cut));
          rest = rest.slice(cut);
        }
        line = rest;
      }
      lines.push(line);
    }
    return lines;
  };

  let page;
  let y;
  const width = A4[0] - MARGIN * 2;
  const newPage = () => {
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
  };
  const room = (height) => {
    if (y - height < MARGIN + 24) newPage();
  };
  const text = (value, x, size, font = sans, color = BLACK) => page.drawText(clean(value, font), { x, y, size, font, color });
  const rule = (weight = 0.6, color = RULE) => page.drawLine({ start: { x: MARGIN, y }, end: { x: A4[0] - MARGIN, y }, thickness: weight, color });

  // ---- Cover block
  newPage();
  text('THE CODE CONSORTIUM', MARGIN, 9, mono);
  text(brief.reference, A4[0] - MARGIN - mono.widthOfTextAtSize(brief.reference, 9), 9, mono);
  y -= 46;
  text('Project brief', MARGIN, 30, bold);
  y -= 26;
  const who = [brief.contact.business, brief.contact.name].filter(Boolean).join(' · ');
  for (const line of wrap(who, sans, 13, width)) {
    text(line, MARGIN, 13);
    y -= 17;
  }
  const when = brief.submittedAt ? new Date(brief.submittedAt) : new Date();
  text(`${when.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, ${when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`.toUpperCase(), MARGIN, 8, mono, GREY);
  y -= 22;
  rule(1.2, BLACK);
  y -= 30;

  const sections = briefSections(brief, files);

  // ---- Sections
  for (const section of sections) {
    room(60);
    text(section.title, MARGIN, 15, bold);
    y -= 12;
    rule();
    y -= 18;

    for (const [label, value] of section.rows) {
      const labelLines = wrap(label.toUpperCase(), mono, 7.5, LABEL_W - 12);
      const lines = wrap(value, sans, 10, width - LABEL_W);
      const height = Math.max(labelLines.length * 11, lines.length * 14);
      room(Math.min(height, 120));
      const top = y;
      labelLines.forEach((line, i) => page.drawText(line, { x: MARGIN, y: top - i * 11, size: 7.5, font: mono, color: GREY }));
      lines.forEach((line) => {
        if (y < MARGIN + 24) {
          newPage();
        }
        text(line, MARGIN + LABEL_W, 10);
        y -= 14;
      });
      y = Math.min(y, top - labelLines.length * 11) - 8;
    }

    if (section.colours?.length) {
      room(70);
      page.drawText('COLOURS', { x: MARGIN, y, size: 7.5, font: mono, color: GREY });
      section.colours.forEach((hex, i) => {
        const x = MARGIN + LABEL_W + i * 62;
        const [r, g, b] = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
        page.drawRectangle({ x, y: y - 36, width: 44, height: 44, color: rgb(r, g, b), borderColor: RULE, borderWidth: 0.6 });
        page.drawText(hex.toUpperCase(), { x, y: y - 48, size: 7, font: mono, color: BLACK });
      });
      y -= 66;
    }

    if (section.concepts?.length) {
      room(30);
      page.drawText('DESIGNS OF OURS THEY LIKE', { x: MARGIN, y, size: 7.5, font: mono, color: GREY });
      y -= 14;
      const cardW = (width - 2 * 14) / 3;
      const cardH = cardW / 1.6;
      for (let i = 0; i < section.concepts.length; i += 3) {
        const row = section.concepts.slice(i, i + 3);
        const notes = row.map((concept) => wrap(concept.note || '', sans, 8.5, cardW));
        room(cardH + 30 + Math.max(...notes.map((lines) => lines.length)) * 11);
        for (const [j, concept] of row.entries()) {
          const x = MARGIN + j * (cardW + 14);
          const bytes = await asJpeg(concept.image, 600);
          if (bytes) {
            const image = await doc.embedJpg(bytes);
            page.drawImage(image, { x, y: y - cardH, width: cardW, height: cardH });
          }
          page.drawRectangle({ x, y: y - cardH, width: cardW, height: cardH, borderColor: RULE, borderWidth: 0.6 });
          page.drawText(clean(concept.name, bold), { x, y: y - cardH - 13, size: 9, font: bold, color: BLACK });
          notes[j].forEach((line, k) => page.drawText(line, { x, y: y - cardH - 26 - k * 11, size: 8.5, font: sans, color: GREY }));
        }
        y -= cardH + 30 + Math.max(...notes.map((lines) => lines.length)) * 11;
      }
    }

    if (section.links?.length) {
      room(30);
      page.drawText('LINKS', { x: MARGIN, y, size: 7.5, font: mono, color: GREY });
      for (const link of section.links) {
        const lines = [...wrap(link.url, sans, 9.5, width - LABEL_W), ...(link.note ? wrap(link.note, sans, 9, width - LABEL_W).map((line) => `  ${line}`) : [])];
        room(lines.length * 13);
        lines.forEach((line, i) => {
          text(line, MARGIN + LABEL_W, i === 0 ? 9.5 : 9, sans, i === 0 ? BLACK : GREY);
          y -= 13;
        });
        y -= 4;
      }
      y -= 6;
    }

    if (section.files?.length) {
      room(30);
      page.drawText('FILES (ATTACHED)', { x: MARGIN, y, size: 7.5, font: mono, color: GREY });
      for (const file of section.files) {
        room(14);
        text(file.name, MARGIN + LABEL_W, 9.5);
        page.drawText(file.size, { x: A4[0] - MARGIN - mono.widthOfTextAtSize(file.size, 8), y, size: 8, font: mono, color: GREY });
        y -= 14;
      }
      y -= 6;
    }

    y -= 18;
  }

  // ---- The pictures they sent, so the brief reads on its own
  const pictures = files.filter((file) => /^image\/(png|jpeg|webp|gif)$/.test(file.type)).slice(0, 8);
  if (pictures.length) {
    newPage();
    text('Pictures they sent', MARGIN, 15, bold);
    y -= 12;
    rule();
    y -= 18;
    const cellW = (width - 16) / 2;
    const cellH = 230;
    for (let i = 0; i < pictures.length; i += 1) {
      const column = i % 2;
      if (column === 0) room(cellH + 24);
      const bytes = await asJpeg(pictures[i], 1000);
      const x = MARGIN + column * (cellW + 16);
      if (bytes) {
        const image = await doc.embedJpg(bytes);
        const scale = Math.min(cellW / image.width, cellH / image.height);
        page.drawImage(image, { x, y: y - image.height * scale, width: image.width * scale, height: image.height * scale });
      }
      page.drawText(clean(pictures[i].name).slice(0, 60), { x, y: y - cellH - 12, size: 7.5, font: mono, color: GREY });
      if (column === 1 || i === pictures.length - 1) y -= cellH + 28;
    }
  }

  // ---- Footer on every page
  const pages = doc.getPages();
  pages.forEach((each, i) => {
    const footer = `${brief.reference} · PAGE ${i + 1} OF ${pages.length}`;
    each.drawLine({ start: { x: MARGIN, y: MARGIN }, end: { x: A4[0] - MARGIN, y: MARGIN }, thickness: 0.6, color: RULE });
    each.drawText('THE CODE CONSORTIUM · THECODECONSORTIUM.COM', { x: MARGIN, y: MARGIN - 14, size: 7, font: mono, color: GREY });
    each.drawText(footer, { x: A4[0] - MARGIN - mono.widthOfTextAtSize(footer, 7), y: MARGIN - 14, size: 7, font: mono, color: GREY });
  });

  return doc.save();
}
