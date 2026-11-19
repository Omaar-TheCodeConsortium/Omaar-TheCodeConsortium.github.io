import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BUTTON_DARK, BUTTON_LIGHT, LABEL } from '../components/ProductBits.jsx';
import { LISTED } from '../concepts/registry.js';
import Turnstile from '../forms/Turnstile.jsx';
import { sendForm } from '../forms/send.js';
import {
  CONTENT,
  CURRENCIES,
  DEVICES,
  DOMAIN,
  FILE_ACCEPT,
  FILE_LIMITS,
  FIRM,
  KINDS,
  OFFLINE,
  PAGES,
  PRIORITY,
  SITE_FEATURES,
  START,
  STEPS,
  STYLES,
  SUBSCRIPTION,
  USER_COUNT,
  YES_NO,
  emptyBrief,
  fileType,
  needsSystem,
  needsWebsite,
  newReference,
  problems,
} from '../brief/questions.js';
import { briefSections, conceptImage, fileSize } from '../brief/summary.js';

// The project brief: a checklist a customer fills in (or we fill in with them on a call) to tell us
// what they want built. Reached only by link. Answers are kept on this device until sent; sending
// emails them to us as a PDF with a copy to the customer. Nothing is stored on our side.

const DRAFT_KEY = 'tcc-brief-draft';
const FIELD =
  'w-full rounded-none border border-gray-300 bg-white p-3 text-base outline-none transition-colors focus:border-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black aria-[invalid=true]:border-red-700';
const SMALL_BUTTON =
  'inline-flex min-h-[44px] items-center justify-center border border-gray-300 bg-white px-4 font-mono text-xs uppercase tracking-widest transition-colors hover:border-black active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-40';
const pad = (n) => String(n).padStart(2, '0');

// ---------------------------------------------------------------- Building blocks

function Field({ label, hint, error, children }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={`${LABEL} mb-2 block text-black`}>
        {label}
      </label>
      {hint ? <p className="-mt-1 mb-2 text-sm text-gray-500">{hint}</p> : null}
      {children({ id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': error ? `${id}-error` : undefined })}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Text({ label, hint, error, value, onChange, type = 'text', rows, ...rest }) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(props) =>
        rows ? (
          <textarea {...props} {...rest} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className={`${FIELD} resize-y`} />
        ) : (
          <input {...props} {...rest} type={type} value={value} onChange={(event) => onChange(event.target.value)} className={FIELD} />
        )
      }
    </Field>
  );
}

// A set of choices drawn as buttons over real checkboxes or radio buttons.
function Choices({ legend, hint, error, options, value, onChange, multiple = false, wide = false }) {
  const name = useId();
  const chosen = (option) => (multiple ? value.includes(option.id ?? option) : value === (option.id ?? option));
  const toggle = (option) => {
    const id = option.id ?? option;
    if (multiple) onChange(value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id]);
    else onChange(value === id ? '' : id);
  };
  return (
    <fieldset aria-invalid={error ? 'true' : undefined}>
      <legend className={`${LABEL} mb-2 text-black`}>{legend}</legend>
      {hint ? <p className="-mt-1 mb-3 text-sm text-gray-500">{hint}</p> : null}
      <div className={wide ? 'grid gap-2 sm:grid-cols-2' : 'flex flex-wrap gap-2'}>
        {options.map((option) => {
          const id = option.id ?? option;
          return (
            <label key={id} className="relative block cursor-pointer">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                checked={chosen(option)}
                onChange={() => toggle(option)}
                onClick={(event) => {
                  // Lets a chosen radio be cleared by choosing it again.
                  if (!multiple && chosen(option)) {
                    event.preventDefault();
                    toggle(option);
                  }
                }}
                className="peer sr-only"
              />
              <span
                className={`flex min-h-[44px] flex-col justify-center border px-4 py-2.5 text-sm transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.98] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black ${
                  chosen(option) ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black hover:border-black'
                }`}
              >
                <span className="font-semibold">{option.label ?? option}</span>
                {option.hint ? <span className={`mt-0.5 text-[13px] leading-snug ${chosen(option) ? 'text-gray-300' : 'text-gray-500'}`}>{option.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </fieldset>
  );
}

function Group({ title, children }) {
  return (
    <section className="space-y-6 border-t border-gray-300 pt-8">
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------- Steps

function StepYou({ brief, set, errors }) {
  const c = brief.contact;
  const put = (key) => (value) => set((draft) => ({ ...draft, contact: { ...draft.contact, [key]: value } }));
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Text label="Your name" value={c.name} onChange={put('name')} autoComplete="name" error={errors.name} required />
        <Text label="Business name" value={c.business} onChange={put('business')} autoComplete="organization" />
        <Text label="Email" type="email" value={c.email} onChange={put('email')} autoComplete="email" error={errors.email} required />
        <Text label="Phone or WhatsApp" type="tel" value={c.phone} onChange={put('phone')} autoComplete="tel" />
        <Text label="Your role" hint="Owner, manager, and so on." value={c.role} onChange={put('role')} autoComplete="organization-title" />
        <Text label="Country" value={c.country} onChange={put('country')} autoComplete="country-name" />
      </div>
      <div className="border border-dashed border-gray-300 p-4">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={c.onCall} onChange={(event) => put('onCall')(event.target.checked)} className="h-5 w-5 accent-black" />
          We’re filling this in for the customer, on a call
        </label>
        {c.onCall ? (
          <div className="mt-3">
            <Text label="Filled in by" hint="Your name, so the brief shows who took it." value={c.takenBy} onChange={put('takenBy')} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StepProject({ brief, set, errors }) {
  const p = brief.project;
  const put = (key) => (value) => set((draft) => ({ ...draft, project: { ...draft.project, [key]: value } }));
  return (
    <div className="space-y-8">
      <Choices legend="What would you like built?" hint="Choose all that apply." options={KINDS} value={p.kinds} onChange={put('kinds')} multiple wide error={errors.kinds} />
      <Text
        label="Describe it in your own words"
        hint="What should it do, and for whom? A few sentences is plenty."
        rows={5}
        value={p.summary}
        onChange={put('summary')}
        error={errors.summary}
        required
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Text label="What kind of business is it?" hint="A hotel, a tailor, a clinic, a factory…" value={p.industry} onChange={put('industry')} />
        <Text label="What do you use today?" hint="Paper, spreadsheets, another system…" value={p.current} onChange={put('current')} />
      </div>
      <Text label="What isn’t working about it?" rows={3} value={p.problems} onChange={put('problems')} />
      <Choices
        legend="Would a subscription work for you?"
        hint="Some systems we build once and offer to similar businesses as a monthly subscription, which costs you much less up front."
        options={SUBSCRIPTION}
        value={p.subscription}
        onChange={put('subscription')}
      />
    </div>
  );
}

function StepNeeds({ brief, set }) {
  const w = brief.website;
  const s = brief.system;
  const putW = (key) => (value) => set((draft) => ({ ...draft, website: { ...draft.website, [key]: value } }));
  const putS = (key) => (value) => set((draft) => ({ ...draft, system: { ...draft.system, [key]: value } }));
  const setFeature = (index, change) => putS('features')(s.features.map((feature, i) => (i === index ? { ...feature, ...change } : feature)));
  const website = needsWebsite(brief.project.kinds);
  const system = needsSystem(brief.project.kinds);

  return (
    <div className="space-y-10">
      {website ? (
        <Group title="The website">
          <Choices legend="Pages" hint="Roughly which pages it needs." options={PAGES} value={w.pages} onChange={putW('pages')} multiple />
          <Text label="Other pages" value={w.pagesOther} onChange={putW('pagesOther')} />
          <Choices legend="Features" options={SITE_FEATURES} value={w.features} onChange={putW('features')} multiple />
          <Text label="Other features" value={w.featuresOther} onChange={putW('featuresOther')} />
          <div className="grid gap-6 md:grid-cols-2">
            <Text label="Languages" hint="English, Sinhala, Tamil…" value={w.languages} onChange={putW('languages')} />
            <Text label="Domain name, if you have one" hint="For example yourbusiness.com" value={w.domainName} onChange={putW('domainName')} />
          </div>
          <Choices legend="Do you have a domain?" options={DOMAIN} value={w.domain} onChange={putW('domain')} />
          <Choices legend="Are your text and photos ready?" options={CONTENT} value={w.content} onChange={putW('content')} />
        </Group>
      ) : null}

      {system ? (
        <Group title={website ? 'The system behind it' : 'The system'}>
          <Text label="Who will use it, and what does each of them do?" hint="For example: cashiers take orders, the manager sees reports, the owner sets prices." rows={4} value={s.users} onChange={putS('users')} />
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="How many people will use it?">
              {(props) => (
                <select {...props} value={s.userCount} onChange={(event) => putS('userCount')(event.target.value)} className={FIELD}>
                  <option value="">Choose…</option>
                  {USER_COUNT.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              )}
            </Field>
            <Text label="How many locations or branches?" value={s.locations} onChange={putS('locations')} />
          </div>

          <fieldset>
            <legend className={`${LABEL} mb-2 text-black`}>What must it do?</legend>
            <p className="-mt-1 mb-3 text-sm text-gray-500">One job per line, such as “take orders at the counter” or “track fabric stock”.</p>
            <ol className="space-y-2">
              {s.features.map((feature, index) => (
                <li key={index} className="grid grid-cols-[2rem_1fr] gap-2 sm:grid-cols-[2rem_1fr_10rem_auto]">
                  <span className="pt-3.5 font-mono text-xs text-gray-400">{pad(index + 1)}</span>
                  <input aria-label={`Job ${index + 1}`} value={feature.name} onChange={(event) => setFeature(index, { name: event.target.value })} className={FIELD} />
                  <select
                    aria-label={`How important job ${index + 1} is`}
                    value={feature.priority}
                    onChange={(event) => setFeature(index, { priority: event.target.value })}
                    className={`${FIELD} col-start-2 sm:col-start-auto`}
                  >
                    {PRIORITY.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => putS('features')(s.features.filter((_, i) => i !== index))}
                    disabled={s.features.length === 1}
                    className={`${SMALL_BUTTON} col-start-2 sm:col-start-auto`}
                    aria-label={`Remove job ${index + 1}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => putS('features')([...s.features, { name: '', priority: 'Must have' }])} className={`${SMALL_BUTTON} mt-3`} disabled={s.features.length >= 30}>
              + Add another
            </button>
          </fieldset>

          <Choices legend="What will it run on?" options={DEVICES} value={s.devices} onChange={putS('devices')} multiple />
          <Choices legend="Must it work when the internet is down?" options={OFFLINE} value={s.offline} onChange={putS('offline')} />
          <div className="grid gap-6 md:grid-cols-2">
            <Text label="Payments it should take" hint="Cash, card, bank transfer, online…" value={s.payments} onChange={putS('payments')} />
            <Text label="Other software it should work with" hint="Accounting, a bank, Booking.com…" value={s.integrations} onChange={putS('integrations')} />
          </div>
          <Choices legend="Is there data to bring over from an old system?" options={YES_NO} value={s.migration} onChange={putS('migration')} />
          {s.migration === 'Yes' ? <Text label="What data, and where is it now?" value={s.migrationDetail} onChange={putS('migrationDetail')} /> : null}
          <Text label="Reports you need" hint="Daily sales, stock levels, staff hours…" rows={3} value={s.reports} onChange={putS('reports')} />
        </Group>
      ) : null}
    </div>
  );
}

function Swatch({ colour, index, onChange, onRemove }) {
  // What is typed in the code box, while it is being typed; otherwise the colour itself.
  const [typing, setTyping] = useState(null);
  const text = typing ?? colour;
  return (
    <li className="flex items-center gap-2 border border-gray-300 p-2">
      <input type="color" aria-label={`Colour ${index + 1}`} value={colour} onChange={(event) => onChange(event.target.value)} className="h-11 w-11 cursor-pointer border-0 bg-transparent p-0" />
      <input
        aria-label={`Colour ${index + 1} code`}
        value={text}
        onChange={(event) => {
          setTyping(event.target.value);
          if (/^#[0-9a-f]{6}$/i.test(event.target.value)) onChange(event.target.value.toLowerCase());
        }}
        onBlur={() => setTyping(null)}
        className="w-24 border-b border-gray-300 font-mono text-sm uppercase outline-none focus:border-black"
      />
      <button type="button" onClick={onRemove} className="ml-auto flex h-11 w-11 items-center justify-center text-gray-500 hover:text-black" aria-label={`Remove colour ${index + 1}`}>
        ×
      </button>
    </li>
  );
}

function StepLook({ brief, set, files, setFiles }) {
  const l = brief.look;
  const put = (key) => (value) => set((draft) => ({ ...draft, look: { ...draft.look, [key]: value } }));
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);

  const toggleConcept = (slug) => {
    const next = { ...l.concepts };
    if (slug in next) delete next[slug];
    else next[slug] = '';
    put('concepts')(next);
  };
  const setLink = (index, change) => put('links')(l.links.map((link, i) => (i === index ? { ...link, ...change } : link)));

  const addFiles = (incoming) => {
    const next = [...files];
    const refused = [];
    for (const file of incoming) {
      if (!fileType(file)) refused.push(`${file.name} is a kind of file we can’t take.`);
      else if (next.length >= FILE_LIMITS.count) refused.push(`Only ${FILE_LIMITS.count} files can be attached.`);
      else if (next.reduce((sum, entry) => sum + entry.size, 0) + file.size > FILE_LIMITS.total) refused.push(`${file.name} takes the files over 20 MB. Share large files as a link instead.`);
      else if (!next.some((entry) => entry.name === file.name && entry.size === file.size)) next.push(file);
    }
    setFiles(next);
    setFileError([...new Set(refused)].join(' '));
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Designs of ours you like</h3>
          <p className="mt-1 text-sm text-gray-500">
            Concept websites we built for made-up brands. Choose any you like and tell us what about them.{' '}
            <a href="/concepts/" target="_blank" rel="noopener" className="underline underline-offset-4">
              See them in full ↗
            </a>
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LISTED.map((concept) => {
            const picked = concept.slug in l.concepts;
            return (
              <li key={concept.slug} className={`border transition-colors ${picked ? 'border-black' : 'border-gray-300'}`}>
                <button type="button" aria-pressed={picked} onClick={() => toggleConcept(concept.slug)} className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  <span className="relative block aspect-[16/10] overflow-hidden border-b border-gray-300 bg-gray-100">
                    <img src={conceptImage(concept)} alt="" width={1200} height={750} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                    <span className={`absolute right-2 top-2 flex h-7 min-w-7 items-center justify-center px-2 font-mono text-[11px] uppercase tracking-widest ${picked ? 'bg-black text-white' : 'bg-white/90 text-black'}`}>
                      {picked ? '✓ Chosen' : 'Choose'}
                    </span>
                  </span>
                  <span className="block p-3">
                    <span className="block font-semibold">{concept.name}</span>
                    <span className="block font-mono text-[11px] uppercase tracking-widest text-gray-500">{concept.category}</span>
                  </span>
                </button>
                {picked ? (
                  <div className="px-3 pb-3">
                    <input
                      aria-label={`What you like about ${concept.name}`}
                      placeholder="What do you like about it?"
                      value={l.concepts[concept.slug]}
                      onChange={(event) => put('concepts')({ ...l.concepts, [concept.slug]: event.target.value })}
                      className={FIELD}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <Choices legend="The feel you’re after" options={STYLES} value={l.styles} onChange={put('styles')} multiple />

      <section className="space-y-3">
        <h3 className={`${LABEL} text-black`}>Colours</h3>
        <p className="-mt-1 text-sm text-gray-500">Pick up to six, or paste their codes.</p>
        {l.colours.length ? (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {l.colours.map((colour, index) => (
              <Swatch
                key={index}
                colour={colour}
                index={index}
                onChange={(value) => put('colours')(l.colours.map((entry, i) => (i === index ? value : entry)))}
                onRemove={() => put('colours')(l.colours.filter((_, i) => i !== index))}
              />
            ))}
          </ul>
        ) : null}
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => put('colours')([...l.colours, '#1f2937'])} disabled={l.colours.length >= 6} className={SMALL_BUTTON}>
            + Add a colour
          </button>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" checked={l.logoColours} onChange={(event) => put('logoColours')(event.target.checked)} className="h-5 w-5 accent-black" />
            Use the colours from our logo
          </label>
        </div>
      </section>

      <fieldset className="space-y-3">
        <legend className={`${LABEL} text-black`}>Links</legend>
        <p className="-mt-1 text-sm text-gray-500">Websites you like, Pinterest boards, Figma or Canva files, a Google Pomelli brand kit, your social pages.</p>
        <ol className="space-y-3">
          {l.links.map((link, index) => (
            <li key={index} className="grid gap-2 border-l-2 border-gray-200 pl-3 sm:grid-cols-[1fr_1fr_auto]">
              <input type="url" inputMode="url" aria-label={`Link ${index + 1}`} placeholder="https://" value={link.url} onChange={(event) => setLink(index, { url: event.target.value })} className={FIELD} />
              <input aria-label={`What to look at in link ${index + 1}`} placeholder="What should we look at?" value={link.note} onChange={(event) => setLink(index, { note: event.target.value })} className={FIELD} />
              <button type="button" onClick={() => put('links')(l.links.filter((_, i) => i !== index))} disabled={l.links.length === 1} className={SMALL_BUTTON} aria-label={`Remove link ${index + 1}`}>
                Remove
              </button>
            </li>
          ))}
        </ol>
        <button type="button" onClick={() => put('links')([...l.links, { url: '', note: '' }])} disabled={l.links.length >= 12} className={SMALL_BUTTON}>
          + Add a link
        </button>
      </fieldset>

      <section className="space-y-3">
        <h3 className={`${LABEL} text-black`}>Files</h3>
        <p className="-mt-1 text-sm text-gray-500">Your logo, photos, sketches, menus, price lists, documents. Up to {FILE_LIMITS.count} files and 20 MB in all.</p>
        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles([...event.dataTransfer.files]);
          }}
          className={`flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed p-6 text-center transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-black ${
            dragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-black'
          }`}
        >
          <input
            type="file"
            multiple
            accept={FILE_ACCEPT}
            className="sr-only"
            onChange={(event) => {
              addFiles([...event.target.files]);
              event.target.value = '';
            }}
          />
          <span className="font-semibold">Drop files here, or choose them</span>
          <span className="text-sm text-gray-500">Images, PDFs and office documents</span>
        </label>
        {fileError ? (
          <p role="alert" className="text-sm text-red-700">
            {fileError}
          </p>
        ) : null}
        {files.length ? (
          <ul className="border-t border-gray-300">
            {files.map((file, index) => (
              <li key={`${file.name}-${file.size}`} className="flex items-center gap-3 border-b border-gray-300 py-2">
                <span className="font-mono text-xs text-gray-400">{pad(index + 1)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                <span className="font-mono text-xs text-gray-500">{fileSize(file.size)}</span>
                <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="flex h-11 w-11 items-center justify-center text-gray-500 hover:text-black" aria-label={`Remove ${file.name}`}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="text-sm text-gray-500">Files can’t be saved in the draft, so if you close this page, add them again before sending.</p>
      </section>

      <Text label="Anything else about the look" hint="Things you don’t want, sites you dislike, fonts you love." rows={3} value={l.notes} onChange={put('notes')} />
    </div>
  );
}

function StepTiming({ brief, set }) {
  const t = brief.timing;
  const put = (key) => (value) => set((draft) => ({ ...draft, timing: { ...draft.timing, [key]: value } }));
  return (
    <div className="space-y-8">
      <Choices legend="When would you like to start?" options={START} value={t.start} onChange={put('start')} />
      <div className="grid gap-6 md:grid-cols-2">
        <Text label="Launch by" hint="The month you’d like it live." type="month" value={t.launch} onChange={put('launch')} />
        <Choices legend="Is that date fixed?" options={FIRM} value={t.firm} onChange={put('firm')} />
      </div>
      <Field label="Budget" hint="A rough figure or range helps us suggest what fits. Leave it blank to talk it through.">
        {(props) => (
          <div className="flex">
            <select aria-label="Currency" value={t.currency} onChange={(event) => put('currency')(event.target.value)} className={`${FIELD} w-28 border-r-0`}>
              {CURRENCIES.map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
            <input {...props} value={t.budget} onChange={(event) => put('budget')(event.target.value)} placeholder="For example 500,000 to 800,000" className={FIELD} />
          </div>
        )}
      </Field>
      <Text label="Who makes the decision?" hint="If it isn’t you, who else should be part of the conversation?" value={t.decider} onChange={put('decider')} />
      <Text label="Anything else we should know" rows={4} value={t.other} onChange={put('other')} />
    </div>
  );
}

function Review({ brief, files, goTo }) {
  const sections = briefSections(brief, files);
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <section key={section.title} className="border-t border-gray-300 pt-6">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight">{section.title}</h3>
            <button type="button" onClick={() => goTo(section.step)} className="font-mono text-xs uppercase tracking-widest underline decoration-gray-300 underline-offset-4 hover:decoration-black" aria-label={`Change ${section.title.toLowerCase()}`}>
              Change
            </button>
          </div>
          {section.rows.length ? (
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
              {section.rows.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className={LABEL}>{label}</dt>
                  <dd className="whitespace-pre-line text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          ) : !section.colours?.length && !section.concepts?.length && !section.links?.length && !section.files?.length ? (
            <p className="text-sm text-gray-500">{index === 0 ? '' : 'Nothing added.'}</p>
          ) : null}
          {section.concepts?.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {section.concepts.map((concept) => (
                <li key={concept.slug} className="text-sm">
                  <img src={concept.image} alt="" className="mb-2 aspect-[16/10] w-full border border-gray-300 object-cover object-top" />
                  <strong>{concept.name}</strong>
                  {concept.note ? <span className="block text-gray-600">{concept.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {section.colours?.length ? (
            <ul className="mt-4 flex flex-wrap gap-3" aria-label="Colours">
              {section.colours.map((colour, i) => (
                <li key={i} className="flex items-center gap-2 font-mono text-xs uppercase">
                  <span className="h-8 w-8 border border-gray-300" style={{ background: colour }} />
                  {colour}
                </li>
              ))}
            </ul>
          ) : null}
          {section.links?.length ? (
            <ul className="mt-4 space-y-1 text-sm">
              {section.links.map((link, i) => (
                <li key={i} className="break-all">
                  {link.url}
                  {link.note ? <span className="text-gray-600"> · {link.note}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {section.files?.length ? (
            <ul className="mt-4 space-y-1 text-sm">
              {section.files.map((file) => (
                <li key={file.name}>
                  {file.name} <span className="font-mono text-xs text-gray-500">{file.size}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- The page

const since = (start) => Date.now() - start;

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null');
  } catch {
    return null;
  }
}

async function makePdf(brief, files) {
  const { briefPdf } = await import('../brief/pdf.js');
  return briefPdf(brief, files);
}

function download(bytes, name) {
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function Brief() {
  const [brief, setBrief] = useState(emptyBrief);
  const [files, setFiles] = useState([]);
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [errors, setErrors] = useState({});
  const [restored, setRestored] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [token, setToken] = useState('');
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState({ state: 'idle' });
  const opened = useRef(0);
  const panel = useRef(null);
  const trap = useRef(null);

  // Pick up a draft saved on this device, and give the brief its reference.
  useEffect(() => {
    const draft = readDraft();
    // Timed from when this brief was first opened, so a draft picked up later can be sent at once.
    opened.current = draft?.opened ?? since(0);
    const base = emptyBrief();
    // Restored after the first render, so the page matches its pre-rendered HTML before it changes.
    if (draft?.brief) {
      const saved = draft.brief;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBrief({ ...base, ...saved, contact: { ...base.contact, ...saved.contact }, project: { ...base.project, ...saved.project }, website: { ...base.website, ...saved.website }, system: { ...base.system, ...saved.system }, look: { ...base.look, ...saved.look }, timing: { ...base.timing, ...saved.timing } });
      setStep(Math.min(draft.step ?? 0, STEPS.length - 1));
      setReached(Math.min(draft.reached ?? 0, STEPS.length - 1));
      setRestored(true);
    } else {
      setBrief({ ...base, reference: newReference() });
    }
  }, []);

  // Save the draft as it changes.
  useEffect(() => {
    if (!brief.reference || status.state === 'sent') return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ brief, step, reached, opened: opened.current }));
      } catch {
        // Private browsing or storage full: the brief still works, it just isn't kept.
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [brief, step, reached, status.state]);

  const goTo = (next) => {
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => {
      panel.current?.focus({ preventScroll: true });
      panel.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  };
  const next = () => {
    const found = problems(step, brief);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => {
        const first = panel.current?.querySelector('[aria-invalid="true"]');
        (first?.matches('fieldset') ? first.querySelector('input') : first)?.focus();
      });
      return;
    }
    setReached((value) => Math.max(value, step + 1));
    goTo(step + 1);
  };
  const startAgain = () => {
    if (!window.confirm('Clear every answer and start a new brief?')) return;
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // nothing saved
    }
    setBrief({ ...emptyBrief(), reference: newReference() });
    opened.current = since(0);
    setFiles([]);
    setReached(0);
    setAgreed(false);
    setRestored(false);
    setStatus({ state: 'idle' });
    goTo(0);
  };

  const submit = async (event) => {
    event.preventDefault();
    for (let s = 0; s < 2; s += 1) {
      if (Object.keys(problems(s, brief)).length) {
        goTo(s);
        setErrors(problems(s, brief));
        return;
      }
    }
    if (!agreed) {
      setStatus({ state: 'failed', error: 'Please tick the box to agree to us using these details.' });
      return;
    }
    if (!token) {
      setStatus({ state: 'failed', error: 'The check that you’re a person hasn’t finished. Wait a moment and try again.' });
      return;
    }
    setStatus({ state: 'sending' });
    const stamped = { ...brief, submittedAt: new Date().toISOString(), files: files.map((file) => ({ name: file.name, size: file.size })) };
    let pdf;
    try {
      pdf = await makePdf(stamped, files);
    } catch (error) {
      console.error(error);
      setStatus({ state: 'failed', error: 'We couldn’t put the brief together. Please try again.' });
      return;
    }
    const body = new FormData();
    body.append('brief', JSON.stringify(stamped));
    body.append('pdf', new Blob([pdf], { type: 'application/pdf' }), `${brief.reference}.pdf`);
    files.forEach((file) => body.append('files', new File([file], file.name, { type: fileType(file) })));
    body.append('token', token);
    body.append('started', String(since(opened.current)));
    body.append('website', trap.current?.value ?? '');
    const result = await sendForm('/brief', body);
    if (result.ok) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // nothing saved
      }
      setStatus({ state: 'sent', pdf, email: brief.contact.email });
    } else {
      setStatus({ state: 'failed', error: result.error });
      setRound((value) => value + 1);
    }
  };

  const saveCopy = async () => {
    try {
      download(await makePdf({ ...brief, submittedAt: new Date().toISOString(), files: files.map((file) => ({ name: file.name, size: file.size })) }, files), `${brief.reference || 'project-brief'}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  const sent = status.state === 'sent';

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-gray-50 font-sans text-black antialiased selection:bg-black selection:text-white">
      <header className="border-b border-gray-300 bg-white">
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-6 md:px-12">
          <Link to="/" className="flex items-center gap-4">
            <img alt="" className="h-12 w-auto object-contain" src="/logo.png" />
            <span className="hidden font-mono text-base font-semibold uppercase tracking-widest text-gray-800 sm:block md:text-lg">The Code Consortium</span>
          </Link>
          <p className={LABEL}>
            Project brief {brief.reference ? <span className="text-black">· {brief.reference}</span> : null}
          </p>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-screen-2xl flex-1 border-x border-gray-300 bg-white lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
        <aside className="border-b border-gray-300 p-6 md:p-12 lg:border-b-0 lg:border-r xl:p-16">
          <div className="lg:sticky lg:top-12">
            <p className={`${LABEL} mb-5`}>Project brief</p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">Tell us what to build.</h1>
            <p className="mt-5 max-w-md text-gray-600">
              A website, a business system, an app: work through these steps and we get the whole picture in one go. It takes about fifteen minutes, and your answers are kept on this device until you send them.
            </p>

            {sent ? null : (
              <>
                {/* Phones: a compact progress bar */}
                <div className="mt-8 lg:hidden" aria-hidden="true">
                  <p className={LABEL}>
                    Step {step + 1} of {STEPS.length} · <span className="text-black">{STEPS[step]}</span>
                  </p>
                  <div className="mt-3 grid grid-cols-6 gap-1">
                    {STEPS.map((name, i) => (
                      <span key={name} className={`h-1 ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <nav aria-label="Steps" className="mt-10 hidden lg:block">
                  <ol className="border-t border-gray-300">
                    {STEPS.map((name, i) => {
                      const open = i <= reached;
                      return (
                        <li key={name} className="border-b border-gray-300">
                          <button
                            type="button"
                            onClick={() => open && goTo(i)}
                            disabled={!open}
                            aria-current={i === step ? 'step' : undefined}
                            className={`flex min-h-[52px] w-full items-center gap-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                              i === step ? 'text-black' : open ? 'text-gray-600 hover:text-black' : 'cursor-default text-gray-300'
                            }`}
                          >
                            <span className={`flex h-7 w-7 items-center justify-center border font-mono text-[11px] ${i === step ? 'border-black bg-black text-white' : i < reached ? 'border-black' : 'border-gray-300'}`}>
                              {i < reached && i !== step ? '✓' : pad(i + 1)}
                            </span>
                            <span className={i === step ? 'font-semibold' : ''}>{name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </nav>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {restored ? <p className="text-sm text-gray-500">Picked up where you left off.</p> : null}
                  <button type="button" onClick={startAgain} className="font-mono text-xs uppercase tracking-widest text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-black">
                    Start again
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>

        <div ref={panel} tabIndex={-1} className="scroll-mt-4 p-6 outline-none md:p-12 xl:p-16">
          {sent ? (
            <div className="max-w-xl space-y-6" role="status">
              <p className={LABEL}>Sent · {brief.reference}</p>
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">Thank you. We have your brief.</h2>
              <p className="text-gray-600 md:text-lg">
                A copy is on its way to <strong className="text-black">{status.email}</strong>. We read every brief and will reply within three working days, with questions or to arrange a call.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button type="button" onClick={() => download(status.pdf, `${brief.reference}.pdf`)} className={BUTTON_DARK}>
                  Download the PDF
                </button>
                <button type="button" onClick={startAgain} className={BUTTON_LIGHT}>
                  Start a new brief
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(event) => {
                if (step === STEPS.length - 1) return submit(event);
                event.preventDefault();
                next();
              }}
              noValidate
            >
              <p className={`${LABEL} mb-3`}>
                {pad(step + 1)} / {pad(STEPS.length)}
              </p>
              <h2 className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">{STEPS[step]}</h2>

              {step === 0 ? <StepYou brief={brief} set={setBrief} errors={errors} /> : null}
              {step === 1 ? <StepProject brief={brief} set={setBrief} errors={errors} /> : null}
              {step === 2 ? <StepNeeds brief={brief} set={setBrief} /> : null}
              {step === 3 ? <StepLook brief={brief} set={setBrief} files={files} setFiles={setFiles} /> : null}
              {step === 4 ? <StepTiming brief={brief} set={setBrief} /> : null}
              {step === 5 ? (
                <>
                  <Review brief={brief} files={files} goTo={goTo} />
                  <div className="mt-10 space-y-5 border-t border-gray-300 pt-8">
                    <label className="flex cursor-pointer items-start gap-3 text-sm">
                      <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-black" />
                      <span>
                        I agree to The Code Consortium using these details to reply to this brief, as set out in the{' '}
                        <a href="/privacy" target="_blank" rel="noopener" className="underline underline-offset-4">
                          privacy policy
                        </a>
                        .
                      </span>
                    </label>
                    <Turnstile onToken={setToken} round={round} />
                  </div>
                </>
              ) : null}

              {/* Hidden from people; bots fill it in and their briefs are dropped. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input ref={trap} name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
              </div>

              {status.state === 'failed' ? (
                <p role="alert" className="mt-8 border-l-2 border-red-700 pl-4 text-sm text-red-700">
                  {status.error}
                </p>
              ) : null}

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-gray-300 pt-8">
                {step > 0 ? (
                  <button type="button" onClick={() => goTo(step - 1)} className={BUTTON_LIGHT}>
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex flex-wrap items-center gap-4">
                  {step === STEPS.length - 1 ? (
                    <button type="button" onClick={saveCopy} className={BUTTON_LIGHT}>
                      Download a copy
                    </button>
                  ) : null}
                  <button type="submit" disabled={status.state === 'sending'} className={`${BUTTON_DARK} disabled:cursor-wait disabled:opacity-60`}>
                    {step === STEPS.length - 1 ? (status.state === 'sending' ? 'Sending…' : 'Send the brief') : `Next: ${STEPS[step + 1]} →`}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-300 bg-white">
        <p className="mx-auto max-w-screen-2xl px-6 py-6 font-mono text-xs uppercase tracking-widest text-gray-500 md:px-12">
          © {new Date().getFullYear()} The Code Consortium ·{' '}
          <a href="mailto:contact@thecodeconsortium.com" className="underline underline-offset-4 hover:text-black">
            contact@thecodeconsortium.com
          </a>
        </p>
      </footer>
    </div>
  );
}
