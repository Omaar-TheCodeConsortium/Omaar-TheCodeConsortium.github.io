// Mock catalogue for Hoxen. The company, its products and their figures are invented.
// Device figures are typical published values, rounded, and are here for illustration only.

export const CHARGERS = [
  {
    id: 'h30',
    watts: 30,
    name: 'Hoxen 30',
    price: 19,
    ports: 1,
    splits: { 1: [30] },
    size: [34, 34, 32],
    weight: 44,
    pd: 'PD 3.0, PPS',
    blurb: 'One port, for a phone or a tablet.',
  },
  {
    id: 'h65',
    watts: 65,
    name: 'Hoxen 65',
    price: 39,
    ports: 2,
    splits: { 1: [65], 2: [45, 20] },
    size: [52, 46, 30],
    weight: 104,
    pd: 'PD 3.0, PPS',
    blurb: 'Two ports. Runs a laptop and a phone at once.',
  },
  {
    id: 'h100',
    watts: 100,
    name: 'Hoxen 100',
    price: 59,
    ports: 3,
    splits: { 1: [100], 2: [65, 30], 3: [45, 30, 20] },
    size: [66, 46, 31],
    weight: 172,
    pd: 'PD 3.0, PPS',
    blurb: 'Three ports, for a full desk.',
  },
  {
    id: 'h140',
    watts: 140,
    name: 'Hoxen 140',
    price: 89,
    ports: 4,
    splits: { 1: [140], 2: [100, 40], 3: [65, 45, 30], 4: [65, 30, 25, 20] },
    size: [78, 50, 32],
    weight: 248,
    pd: 'PD 3.1 (28 V), PPS',
    blurb: 'Four ports. Fast-charges a 16-inch laptop.',
  },
];

export const chargerByWatts = (watts) => CHARGERS.find((charger) => charger.watts === Number(watts)) ?? CHARGERS[1];
export const volumeCm3 = (charger) => (charger.size[0] * charger.size[1] * charger.size[2]) / 1000;
export const density = (charger) => charger.watts / volumeCm3(charger);

export const PLUGS = [
  { id: 'us', name: 'US', detail: 'Type A, folds flat' },
  { id: 'eu', name: 'EU', detail: 'Type C, fixed' },
  { id: 'uk', name: 'UK', detail: 'Type G, folds flat' },
];

export const CABLES = [
  { id: 'none', name: 'No cable', detail: 'Use your own', price: 0, limit: null },
  { id: 'c1', name: '1 m', detail: 'Braided, carries 60 W', price: 9, limit: 60 },
  { id: 'c2', name: '2 m', detail: 'Braided, carries 240 W', price: 14, limit: 240 },
];

export const CASE_PRICE = 24;
export const CASE_PRICE_WITH_CHARGER = 19;

export const CASE_MODELS = ['iPhone 17', 'iPhone 17 Pro', 'Galaxy S25', 'Pixel 10'];

// `tint` is null for the colour the case was photographed in.
export const CASE_COLOURS = [
  { id: 'chalk', name: 'Chalk', hex: '#E4E2DB', tint: null },
  { id: 'graphite', name: 'Graphite', hex: '#3B3E44', tint: '#4a4d54' },
  { id: 'signal', name: 'Signal', hex: '#FF5A00', tint: '#ff6a14' },
  { id: 'pine', name: 'Pine', hex: '#2F5145', tint: '#3a6354' },
  { id: 'tide', name: 'Tide', hex: '#4F6F88', tint: '#5d82a0' },
  { id: 'clay', name: 'Clay', hex: '#B5725A', tint: '#c98267' },
];

export const FREE_SHIPPING_FROM = 50;
export const SHIPPING_FLAT = 6;

export const DEVICE_KINDS = ['Phones', 'Tablets', 'Laptops', 'Handhelds and audio'];

// wh: battery size in watt-hours. max: the most the device will draw over USB-C, in watts.
export const DEVICES = [
  { id: 'iphone-17-pro', name: 'iPhone 17 Pro', kind: 'Phones', wh: 16.4, max: 40, hasCase: 'iPhone 17 Pro' },
  { id: 'iphone-17', name: 'iPhone 17', kind: 'Phones', wh: 14.3, max: 40, hasCase: 'iPhone 17' },
  { id: 'galaxy-s25-ultra', name: 'Galaxy S25 Ultra', kind: 'Phones', wh: 19.4, max: 45 },
  { id: 'galaxy-s25', name: 'Galaxy S25', kind: 'Phones', wh: 15.5, max: 25, hasCase: 'Galaxy S25' },
  { id: 'pixel-10', name: 'Pixel 10', kind: 'Phones', wh: 19.2, max: 30, hasCase: 'Pixel 10' },
  { id: 'ipad-air-11', name: 'iPad Air 11-inch', kind: 'Tablets', wh: 28.9, max: 30 },
  { id: 'ipad-pro-13', name: 'iPad Pro 13-inch', kind: 'Tablets', wh: 38.9, max: 40 },
  { id: 'galaxy-tab-s10', name: 'Galaxy Tab S10+', kind: 'Tablets', wh: 38.9, max: 45 },
  { id: 'macbook-air-13', name: 'MacBook Air 13-inch', kind: 'Laptops', wh: 53.8, max: 70 },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14-inch', kind: 'Laptops', wh: 72.4, max: 96 },
  { id: 'macbook-pro-16', name: 'MacBook Pro 16-inch', kind: 'Laptops', wh: 99.6, max: 140 },
  { id: 'xps-13', name: 'Dell XPS 13', kind: 'Laptops', wh: 55, max: 60 },
  { id: 'thinkpad-x1', name: 'ThinkPad X1 Carbon', kind: 'Laptops', wh: 57, max: 65 },
  { id: 'steam-deck', name: 'Steam Deck OLED', kind: 'Handhelds and audio', wh: 50, max: 45 },
  { id: 'switch-2', name: 'Nintendo Switch 2', kind: 'Handhelds and audio', wh: 19.3, max: 39 },
  { id: 'airpods-pro', name: 'AirPods Pro case', kind: 'Handhelds and audio', wh: 1.9, max: 5 },
];

export const deviceById = (id) => DEVICES.find((device) => device.id === id);

// About three quarters of what leaves the port ends up in the battery over the first half of a charge.
const INTO_BATTERY = 0.74;

// Minutes from empty to half full when the device is given `watts`.
export const minutesToHalf = (device, watts) => Math.round(((device.wh * 0.5) / (Math.min(device.max, watts) * INTO_BATTERY)) * 60);

// What each of `devices` (one or two) gets from `charger`: the hungrier device takes the larger share.
// Returns null if the charger has too few ports.
export function shares(charger, devices) {
  const split = charger.splits[devices.length];
  if (!split) return null;
  const order = devices.map((device, index) => ({ device, index })).sort((a, b) => b.device.max - a.device.max);
  const result = [];
  order.forEach(({ device, index }, rank) => {
    const offered = split[rank];
    const drawn = Math.min(device.max, offered);
    result[index] = { device, offered, drawn, full: offered >= device.max, minutes: minutesToHalf(device, offered) };
  });
  return result;
}

// The smallest charger that gives every chosen device its full speed, or the largest one if none does.
export function recommend(devices) {
  if (devices.length === 0) return null;
  const fits = CHARGERS.find((charger) => shares(charger, devices)?.every((share) => share.full));
  return fits ?? CHARGERS[CHARGERS.length - 1];
}

export const formatPrice = (value) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

// Bag lines are { kind: 'charger', watts, plug, cable, qty } or { kind: 'case', model, colour, bundled, qty }.
export const lineKey = (line) =>
  line.kind === 'charger' ? `charger|${line.watts}|${line.plug}|${line.cable}` : `case|${line.model}|${line.colour}|${line.bundled ? 1 : 0}`;

export function linePrice(line) {
  if (line.kind === 'case') return line.bundled ? CASE_PRICE_WITH_CHARGER : CASE_PRICE;
  const cable = CABLES.find((item) => item.id === line.cable) ?? CABLES[0];
  return chargerByWatts(line.watts).price + cable.price;
}

export function lineTitle(line) {
  if (line.kind === 'case') return `Case for ${line.model}`;
  return chargerByWatts(line.watts).name;
}

export function lineDetail(line) {
  if (line.kind === 'case') {
    const colour = CASE_COLOURS.find((item) => item.id === line.colour) ?? CASE_COLOURS[0];
    return `${colour.name}${line.bundled ? ' · bundle price' : ''}`;
  }
  const plug = PLUGS.find((item) => item.id === line.plug) ?? PLUGS[0];
  const cable = CABLES.find((item) => item.id === line.cable) ?? CABLES[0];
  return `${plug.name} plug · ${cable.id === 'none' ? 'no cable' : `${cable.name} cable`}`;
}

export const validLine = (line) =>
  line && (line.kind === 'case' ? CASE_MODELS.includes(line.model) : line.kind === 'charger' && CHARGERS.some((c) => c.watts === line.watts));
