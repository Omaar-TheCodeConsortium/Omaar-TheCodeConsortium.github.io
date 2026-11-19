// The questions in the project brief, their choices, and the empty brief they fill in.
// The form (src/pages/Brief.jsx), the review step and the PDF all read from here.

export const STEPS = ['You', 'The project', 'What it needs', 'Look and feel', 'Timing and budget', 'Review and send'];

export const KINDS = [
  { id: 'website', label: 'A website', hint: 'A site for your business, from one page to many.' },
  { id: 'shop', label: 'An online shop', hint: 'Sell products online and take payments.' },
  { id: 'booking', label: 'Bookings or reservations', hint: 'Rooms, tables, appointments, classes or rentals.' },
  { id: 'system', label: 'A business system', hint: 'Staff, stock, sales, orders, a till, HR: whatever you run the business on.' },
  { id: 'app', label: 'A mobile app', hint: 'For your customers, or for your staff.' },
  { id: 'other', label: 'Something else', hint: 'Not sure what to call it? Describe it on the next screen.' },
];
export const kindLabel = (id) => KINDS.find((kind) => kind.id === id)?.label ?? id;
// Which detail sections apply to the kinds chosen.
export const needsWebsite = (kinds) => kinds.some((kind) => ['website', 'shop', 'booking'].includes(kind));
export const needsSystem = (kinds) => kinds.some((kind) => ['system', 'app', 'booking', 'other'].includes(kind));

export const SUBSCRIPTION = ['Yes, that could work', 'We want to own it outright', 'Not sure, let’s talk'];

export const PAGES = ['Home', 'About us', 'Services', 'Products', 'Menu', 'Rooms', 'Gallery', 'Prices', 'Team', 'Blog or news', 'Questions and answers', 'Contact'];
export const SITE_FEATURES = [
  'Contact or enquiry form',
  'Online bookings',
  'Online payments',
  'Online shop',
  'Menu or price list',
  'Photo gallery',
  'Blog or news',
  'More than one language',
  'Customer accounts and login',
  'WhatsApp or chat button',
  'Map and directions',
  'Newsletter sign-up',
  'Reviews from Google or other sites',
];
export const DOMAIN = ['We have a domain', 'We need one', 'Not sure'];
export const CONTENT = ['Ready', 'Some of it', 'Not yet', 'We’d like help with it'];

export const USER_COUNT = ['Just me', '2 to 10', '11 to 50', '51 to 200', 'More than 200'];
export const DEVICES = ['Desktop computers', 'Laptops', 'Tablets', 'Phones', 'Receipt printer', 'Barcode scanner', 'Card machine'];
export const OFFLINE = ['Yes, it must keep working', 'It would be nice', 'No, we always have internet'];
export const PRIORITY = ['Must have', 'Nice to have'];
export const YES_NO = ['Yes', 'No', 'Not sure'];

export const STYLES = ['Calm and premium', 'Bold and bright', 'Simple and minimal', 'Warm and friendly', 'Corporate and serious', 'Playful', 'Traditional', 'Modern and technical'];

export const START = ['As soon as possible', 'Within 3 months', 'In 3 to 6 months', 'Later than that', 'Just exploring'];
export const FIRM = ['Yes, the date is fixed', 'No, it’s flexible'];
export const CURRENCIES = ['LKR', 'USD', 'GBP', 'EUR', 'AUD'];

// Files we accept, matching worker/src/index.js.
export const FILE_LIMITS = { count: 10, total: 20 * 1024 * 1024 };
export const FILE_ACCEPT = '.png,.jpg,.jpeg,.webp,.gif,.heic,.heif,.pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
const FILE_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  pdf: 'application/pdf',
  txt: 'text/plain',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};
// The type to send a file as, worked out from its name when the browser doesn't say. null if refused.
export function fileType(file) {
  const type = FILE_TYPES[file.name.split('.').pop()?.toLowerCase()];
  return type ?? null;
}

export function newReference(now = new Date()) {
  const date = now.toISOString().slice(2, 10).replace(/-/g, '');
  const tail = Array.from({ length: 4 }, () => '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 32)]).join('');
  return `TCC-${date}-${tail}`;
}

export function emptyBrief() {
  return {
    reference: '',
    contact: { name: '', business: '', email: '', phone: '', country: '', role: '', onCall: false, takenBy: '' },
    project: { kinds: [], summary: '', industry: '', current: '', problems: '', subscription: '' },
    website: { pages: [], pagesOther: '', features: [], featuresOther: '', languages: '', domain: '', domainName: '', content: '' },
    system: {
      users: '',
      userCount: '',
      locations: '',
      features: [{ name: '', priority: 'Must have' }],
      devices: [],
      offline: '',
      payments: '',
      integrations: '',
      migration: '',
      migrationDetail: '',
      reports: '',
    },
    look: { concepts: {}, styles: [], colours: [], logoColours: false, links: [{ url: '', note: '' }], notes: '' },
    timing: { start: '', launch: '', firm: '', currency: 'LKR', budget: '', decider: '', other: '' },
  };
}

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

// The problems that stop a step from moving on, keyed by field. Only the essentials are required.
export function problems(step, brief) {
  const found = {};
  if (step === 0) {
    if (!brief.contact.name.trim()) found.name = 'Add your name.';
    if (!EMAIL.test(brief.contact.email.trim())) found.email = 'Add an email address we can reply to.';
  }
  if (step === 1) {
    if (brief.project.kinds.length === 0) found.kinds = 'Choose at least one.';
    if (brief.project.summary.trim().length < 10) found.summary = 'Tell us a little about it, even a sentence or two.';
  }
  return found;
}
