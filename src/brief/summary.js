import { LISTED } from '../concepts/registry.js';
import { kindLabel, needsSystem, needsWebsite } from './questions.js';

// The screenshot of a concept on the home page's screen wall; Tradewin's two sites share one.
export const conceptImage = (concept) => `/studio/${concept.slug.split('-')[0]}.webp`;

const list = (values) => values.filter(Boolean).join(', ');
export const fileSize = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);
const monthName = (value) => {
  if (!/^\d{4}-\d{2}$/.test(value)) return value;
  const [year, month] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

// The brief as titled sections of answered questions, for the review step and the PDF.
// Unanswered questions are left out. `step` is where each section is edited.
export function briefSections(brief, files = []) {
  const { contact, project, website, system, look, timing } = brief;
  const sections = [];

  sections.push({
    step: 0,
    title: 'Contact',
    rows: [
      ['Name', contact.name],
      ['Business', contact.business],
      ['Their role', contact.role],
      ['Email', contact.email],
      ['Phone', contact.phone],
      ['Country', contact.country],
      ['Filled in by', contact.onCall ? `${contact.takenBy || 'The Code Consortium'}, on a call` : ''],
    ],
  });

  sections.push({
    step: 1,
    title: 'The project',
    rows: [
      ['They want', list(project.kinds.map((kind, i) => (i ? kindLabel(kind).replace(/^A /, 'a ') : kindLabel(kind))))],
      ['In their words', project.summary],
      ['Business type', project.industry],
      ['Used today', project.current],
      ['What isn’t working', project.problems],
      ['As a subscription', project.subscription],
    ],
  });

  if (needsWebsite(project.kinds)) {
    sections.push({
      step: 2,
      title: 'The website',
      rows: [
        ['Pages', list([...website.pages, website.pagesOther])],
        ['Features', list([...website.features, website.featuresOther])],
        ['Languages', website.languages],
        ['Domain', list([website.domain, website.domainName])],
        ['Text and photos', website.content],
      ],
    });
  }

  if (needsSystem(project.kinds)) {
    const features = system.features.filter((feature) => feature.name.trim());
    sections.push({
      step: 2,
      title: 'The system',
      rows: [
        ['Who uses it', system.users],
        ['How many people', system.userCount],
        ['Locations', system.locations],
        ['Must have', features.filter((feature) => feature.priority === 'Must have').map((feature) => `• ${feature.name.trim()}`).join('\n')],
        ['Nice to have', features.filter((feature) => feature.priority !== 'Must have').map((feature) => `• ${feature.name.trim()}`).join('\n')],
        ['Devices', list(system.devices)],
        ['Works offline', system.offline],
        ['Payments', system.payments],
        ['Connects to', system.integrations],
        ['Data to bring over', list([system.migration, system.migrationDetail])],
        ['Reports', system.reports],
      ],
    });
  }

  const concepts = LISTED.filter((concept) => concept.slug in look.concepts).map((concept) => ({
    slug: concept.slug,
    name: concept.name,
    category: concept.category,
    image: conceptImage(concept),
    note: look.concepts[concept.slug],
  }));
  sections.push({
    step: 3,
    title: 'Look and feel',
    rows: [
      ['Style', list(look.styles)],
      ['Colours', look.logoColours ? 'Take them from the logo' : ''],
      ['Notes', look.notes],
    ],
    colours: look.colours,
    concepts,
    links: look.links.filter((link) => link.url.trim()),
    files: files.map((file) => ({ name: file.name, size: fileSize(file.size) })),
  });

  sections.push({
    step: 4,
    title: 'Timing and budget',
    rows: [
      ['Start', timing.start],
      ['Launch by', monthName(timing.launch)],
      ['Date fixed', timing.firm],
      ['Budget', timing.budget ? `${timing.currency} ${timing.budget}` : ''],
      ['Decides', timing.decider],
      ['Anything else', timing.other],
    ],
  });

  return sections.map((section) => ({ ...section, rows: section.rows.filter(([, value]) => value && String(value).trim()) }));
}
