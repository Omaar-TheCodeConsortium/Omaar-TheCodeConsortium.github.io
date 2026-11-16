import { useSyncExternalStore } from 'react';
import { DELIVERY_DAYS } from './catalog.js';

// The clock is read only in the browser. A pre-rendered page carries no time or date, and every
// component that shows one says something that is always true until the clock is known.
const listeners = new Set();
let timer = null;
let current = null;

const read = () => Math.floor(Date.now() / 60000) * 60000;

function subscribe(listener) {
  listeners.add(listener);
  if (current === null) current = read();
  if (!timer) {
    timer = window.setInterval(() => {
      current = read();
      listeners.forEach((each) => each());
    }, 20000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

// The time now, to the minute, or null before the page is running in a browser.
export const useNow = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );

// Orders are packed at 4 pm in Yiwu, which is 08:00 UTC.
const PACKING_HOUR_UTC = 8;
const DAY = 86400000;

// When the next packing run closes, and when a parcel packed in it arrives.
export function packingRun(now) {
  const closes = new Date(now);
  closes.setUTCHours(PACKING_HOUR_UTC, 0, 0, 0);
  if (closes.getTime() <= now) closes.setUTCDate(closes.getUTCDate() + 1);
  const minutes = Math.round((closes.getTime() - now) / 60000);
  return {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
    from: new Date(closes.getTime() + DELIVERY_DAYS[0] * DAY),
    to: new Date(closes.getTime() + DELIVERY_DAYS[1] * DAY),
  };
}

const dayMonth = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
export const formatDay = (date) => dayMonth.format(date);

export const formatLeft = ({ hours, minutes }) => (hours > 0 ? `${hours} h ${String(minutes).padStart(2, '0')} min` : `${minutes} min`);

// "23 to 28 Nov", or "28 Nov to 3 Dec" across a month end.
export function formatSpan(from, to) {
  const sameMonth = from.getUTCMonth() === to.getUTCMonth();
  return sameMonth ? `${from.getUTCDate()} to ${formatDay(to)}` : `${formatDay(from)} to ${formatDay(to)}`;
}
