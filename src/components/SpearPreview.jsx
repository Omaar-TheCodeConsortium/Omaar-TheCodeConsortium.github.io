import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import '@fontsource-variable/manrope';

gsap.registerPlugin(useGSAP);

// A short film of Spear OS at work, drawn in the product's own colours and type and played with GSAP:
// a Booking.com booking lands on the room calendar, the guest's dinner is charged to her room,
// and at checkout it is already on her bill. Drawn once at a fixed size and scaled to fit;
// on phones a camera follows the action up close. It plays only while on screen.

const W = 1040;
const H = 680;
const PHONE = '(max-width: 639px)';


const SCENES = [
  {
    title: 'A booking lands',
    line: 'A Booking.com reservation drops onto the room calendar, and room 204 is taken on every channel at once.',
  },
  {
    title: 'Dinner goes on the room',
    line: 'At the bistro, the waiter charges table 5 to room 204. The till keeps trading even when the internet drops.',
  },
  {
    title: 'One bill at checkout',
    line: 'The dinner is already on her folio. She pays once, and the room goes straight to housekeeping.',
  },
];

// ---------------------------------------------------------------- Small pictures

function Icon({ children, size = 22, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

const RAIL = [
  {
    key: 'overview',
    icon: (
      <>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </>
    ),
  },
  {
    key: 'desk',
    icon: (
      <>
        <path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" />
        <path d="M20 16a8 8 0 1 0-16 0" />
        <path d="M12 4v4" />
        <path d="M10 4h4" />
      </>
    ),
  },
  {
    key: 'rooms',
    icon: (
      <>
        <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
        <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
        <path d="M12 4v6" />
        <path d="M2 18h20" />
      </>
    ),
  },
  {
    key: 'restaurant',
    icon: (
      <>
        <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
        <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
        <path d="m2.1 21.8 6.4-6.3" />
        <path d="m19 5-7 7" />
      </>
    ),
  },
  {
    key: 'kitchen',
    icon: (
      <>
        <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" />
        <path d="M6 17h12" />
      </>
    ),
  },
  { key: 'housekeeping', icon: SPRAY() },
];
const RAIL_TOP = 72;
const RAIL_STEP = 50;
const railIndex = (key) => RAIL.findIndex((item) => item.key === key);
// The rail item each scene lights up.
const SCENE_RAIL = ['rooms', 'restaurant', 'desk'].map(railIndex);

function SPRAY() {
  return (
    <>
      <path d="M3 3h.01" />
      <path d="M7 5h.01" />
      <path d="M11 7h.01" />
      <path d="M3 7h.01" />
      <path d="M7 9h.01" />
      <path d="M3 11h.01" />
      <rect width="4" height="4" x="15" y="5" />
      <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" />
      <path d="m13 14 8-2" />
      <path d="m13 19 8-2" />
    </>
  );
}

const CHECK = <path d="M20 6 9 17l-5-5" />;

// Booking channel colours and marks. Logo paths from Simple Icons (CC0).
const CHANNEL = {
  direct: { name: 'Direct', tint: '#e3ebe2', ink: '#36533d', edge: '#4e7356' },
  booking: {
    name: 'Booking.com',
    tint: '#e2e8f5',
    ink: '#0b2f73',
    edge: '#003a9a',
    bg: '#ffffff',
    fill: '#003a9a',
    d: 'M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z',
  },
  expedia: {
    name: 'Expedia',
    tint: '#fbf0c2',
    ink: '#191e3b',
    edge: '#191e3b',
    bg: '#191e3b',
    fill: '#fddb32',
    d: 'M19.067 0H4.933A4.94 4.94 0 0 0 0 4.933v14.134A4.932 4.932 0 0 0 4.933 24h14.134A4.932 4.932 0 0 0 24 19.067V4.933C24.01 2.213 21.797 0 19.067 0ZM7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337zm12.121-1.486-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z',
  },
  airbnb: {
    name: 'Airbnb',
    tint: '#fde4e4',
    ink: '#b3263a',
    edge: '#ff5a5f',
    bg: '#ff5a5f',
    fill: '#ffffff',
    scale: 0.66,
    d: 'M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z',
  },
};

function Logo({ id, size = 18 }) {
  const c = CHANNEL[id];
  const box = { width: size, height: size, borderRadius: size * 0.24 };
  if (id === 'direct') {
    return (
      <span className="inline-flex flex-none items-center justify-center bg-[#c79a45] text-[#221b16]" style={box}>
        <Icon size={size * 0.7}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </Icon>
      </span>
    );
  }
  const inner = size * (c.scale ?? 1);
  return (
    <span className="inline-flex flex-none items-center justify-center overflow-hidden" style={{ ...box, background: c.bg }}>
      <svg viewBox="0 0 24 24" width={inner} height={inner} fill={c.fill}>
        <path d={c.d} />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------- Scene 1: room calendar

const DAYS = ['Thu 4', 'Fri 5', 'Sat 6', 'Sun 7', 'Mon 8', 'Tue 9', 'Wed 10'];
const ROOMS = [
  ['101', 'Deluxe King'],
  ['102', 'Deluxe King'],
  ['203', 'Junior Suite'],
  ['204', 'Junior Suite'],
  ['305', 'Garden Suite'],
  ['306', 'Garden Suite'],
];
const STAYS = [
  { room: 0, name: 'Giulia Marchetti', via: 'direct', from: 0, nights: 2 },
  { room: 1, name: 'Kenji Sato', via: 'expedia', from: 1, nights: 4 },
  { room: 2, name: 'Amira Haddad', via: 'direct', from: 2, nights: 3 },
  { room: 3, name: 'Tom Becker', via: 'direct', from: 4, nights: 2 },
  { room: 4, name: 'Luca Romano', via: 'airbnb', from: 0, nights: 5 },
  { room: 5, name: 'Priya Nair', via: 'direct', from: 3, nights: 4 },
];
const NEW_STAY = { room: 3, name: 'Hannah Weber', via: 'booking', from: 0, nights: 3 };
const G = { x: 28, y: 108, label: 118, day: 116, head: 40, row: 58 };

function Stay({ stay, d }) {
  const c = CHANNEL[stay.via];
  return (
    <div
      data-sp={d}
      className={`absolute flex items-center gap-2.5 overflow-hidden rounded-lg pl-4 pr-3 ${d ? 'invisible opacity-0' : ''}`}
      style={{
        left: G.x + G.label + stay.from * G.day + 4,
        width: stay.nights * G.day - 8,
        top: G.y + G.head + stay.room * G.row + 8,
        height: G.row - 16,
        background: c.tint,
        color: c.ink,
        boxShadow: `inset 4px 0 0 ${c.edge}`,
        transformOrigin: 'left center',
      }}
    >
      <Logo id={stay.via} size={18} />
      <span className="truncate text-[14px] font-semibold">{stay.name}</span>
      {stay.nights > 2 ? <span className="ml-auto flex-none text-[12px] opacity-75">{stay.nights} nights</span> : null}
    </div>
  );
}

function RoomsScene() {
  return (
    <div data-sp="scene0" className="absolute inset-0">
      <div className="absolute left-7 top-6">
        <p className="text-[24px] font-semibold tracking-[-0.02em]">Rooms</p>
        <p className="relative mt-0.5 h-5 text-[14px] text-[#5c4f44]">
          <span data-sp="let0" className="absolute left-0 whitespace-nowrap">
            Thu 4 – Wed 10 Oct · 18 of 24 rooms let tonight
          </span>
          <span data-sp="let1" className="invisible absolute left-0 whitespace-nowrap opacity-0">
            Thu 4 – Wed 10 Oct · <b className="font-semibold text-[#221b16]">19 of 24</b> rooms let tonight
          </span>
        </p>
      </div>

      {/* Tonight's column */}
      <div className="absolute rounded-lg bg-[#c79a45]/10" style={{ left: G.x + G.label, top: G.y, width: G.day, height: G.head + ROOMS.length * G.row }} />
      {DAYS.map((day, i) => (
        <p
          key={day}
          className={`absolute text-center text-[13px] font-semibold ${i === 0 ? 'text-[#7c5801]' : 'text-[#5c4f44]'}`}
          style={{ left: G.x + G.label + i * G.day, top: G.y + 11, width: G.day }}
        >
          {i === 0 ? 'Tonight' : day}
        </p>
      ))}
      {ROOMS.map(([number, kind], i) => (
        <div
          key={number}
          data-sp={i === 3 ? 'row204' : undefined}
          className="absolute rounded-lg border-b border-[rgba(199,154,69,0.16)]"
          style={{ left: G.x, top: G.y + G.head + i * G.row, width: G.label + DAYS.length * G.day, height: G.row }}
        >
          <p className="absolute left-2 top-2.5 text-[15px] font-bold leading-tight">
            {number}
            <span className="block text-[12px] font-medium text-[#5c4f44]">{kind}</span>
          </p>
        </div>
      ))}
      {STAYS.map((stay) => (
        <Stay key={stay.name} stay={stay} />
      ))}
      <Stay stay={NEW_STAY} d="new-stay" />

      <ul className="absolute left-7 flex gap-6 text-[13px] text-[#5c4f44]" style={{ top: G.y + G.head + ROOMS.length * G.row + 26 }}>
        {['booking', 'expedia', 'airbnb', 'direct'].map((id) => (
          <li key={id} className="flex items-center gap-2">
            <Logo id={id} size={18} />
            {CHANNEL[id].name}
          </li>
        ))}
        <li className="flex items-center gap-2 font-semibold text-[#36533d]">
          <span className="h-2 w-2 rounded-full bg-[#4e7356]" /> 5 channels in step
        </li>
      </ul>

      <div
        data-sp="toast"
        className="invisible absolute right-7 top-3 flex w-[340px] gap-3.5 rounded-xl border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] p-4 opacity-0 shadow-[0_18px_40px_-16px_rgba(34,27,22,0.4)]"
      >
        <Logo id="booking" size={38} />
        <div className="leading-snug">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c4f44]">New booking · Booking.com</p>
          <p className="mt-0.5 text-[17px] font-bold">Hannah Weber</p>
          <p className="text-[13px] text-[#5c4f44]">Junior Suite · 3 nights from tonight</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#36533d]">
            <Icon size={15}>{CHECK}</Icon> Room 204 assigned
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Scene 2: restaurant till

const DISHES = [
  ['Grilled prawns', 'Garlic, chilli, lime', 18],
  ['Seafood linguine', 'Prawns, squid, tomato', 26],
  ['Lamb kofta', 'Mint yoghurt, flatbread', 24],
  ['Catch of the day', 'With coconut sambol', 28],
  ['Lime tart', 'Torched meringue', 9],
  ['Fresh lime soda', 'Sweet or salted', 5],
];
// The dishes the waiter adds, by index, and the ticket total after each.
const ORDER = [0, 1, 3];
const TOTALS = [10, 28, 54, 82];
const TILE = { x: 28, y: 146, w: 176, h: 112, gap: 14 };

function TillScene() {
  return (
    <div data-sp="scene1" className="invisible absolute inset-0 opacity-0">
      <div className="absolute left-7 top-6">
        <p className="text-[24px] font-semibold tracking-[-0.02em]">Azure Bistro</p>
        <p className="mt-0.5 text-[14px] text-[#5c4f44]">Evening service · 14 of 22 tables seated</p>
      </div>
      <ul className="absolute left-7 top-[96px] flex gap-2 text-[14px] font-semibold">
        {['Starters', 'Mains', 'Desserts', 'Drinks'].map((name, i) => (
          <li key={name} className={`rounded-full border px-4 py-1.5 ${i === 0 ? 'border-[#221b16] bg-[#221b16] text-[#f7f1e6]' : 'border-[rgba(199,154,69,0.28)] text-[#5c4f44]'}`}>
            {name}
          </li>
        ))}
      </ul>
      {DISHES.map(([name, note, price], i) => (
        <div
          key={name}
          data-sp={`dish${i}`}
          className="absolute flex flex-col rounded-xl border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] p-4"
          style={{ left: TILE.x + (i % 3) * (TILE.w + TILE.gap), top: TILE.y + Math.floor(i / 3) * (TILE.h + TILE.gap), width: TILE.w, height: TILE.h }}
        >
          <span className="text-[15px] font-semibold leading-tight">{name}</span>
          <span className="mt-1 text-[12px] text-[#5c4f44]">{note}</span>
          <span className="mt-auto text-[16px] font-bold tabular-nums">${price}</span>
        </div>
      ))}
      <p className="absolute left-7 flex items-center gap-2.5 rounded-full border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] px-4 py-2 text-[13px] text-[#5c4f44]" style={{ top: TILE.y + 2 * (TILE.h + TILE.gap) + 14 }}>
        <span className="h-2 w-2 rounded-full bg-[#4e7356]" />
        <b className="font-semibold text-[#221b16]">Till 2</b> saves every order on the till itself, so service carries on offline
      </p>

      <div data-sp="ticket" className="absolute right-7 top-5 flex h-[584px] w-[340px] flex-col rounded-2xl border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] p-5 shadow-[0_18px_40px_-24px_rgba(34,27,22,0.35)]">
        <p className="flex items-baseline justify-between">
          <span className="text-[20px] font-bold tracking-[-0.01em]">Table 5</span>
          <span className="text-[13px] text-[#5c4f44]">2 guests · Nimal</span>
        </p>
        <p className="mt-2 inline-flex items-center gap-2 self-start rounded-full bg-[#c79a45]/20 px-3 py-1 text-[13px] font-semibold text-[#7c5801]">
          <Icon size={15}>
            <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
            <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
            <path d="M2 18h20" />
          </Icon>
          Hannah Weber · Room 204
        </p>
        <ul className="mt-5 border-t border-[rgba(199,154,69,0.16)] text-[15px]">
          <li className="flex justify-between border-b border-[rgba(199,154,69,0.16)] py-2.5">
            <span>2 × Fresh lime soda</span>
            <span className="tabular-nums">$10</span>
          </li>
          {ORDER.map((dish, i) => (
            <li key={dish} data-sp={`line${i}`} className="invisible flex justify-between border-b border-[rgba(199,154,69,0.16)] py-2.5 opacity-0">
              <span>{DISHES[dish][0]}</span>
              <span className="tabular-nums">${DISHES[dish][2]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-auto flex items-baseline justify-between pb-4">
          <span className="text-[15px] font-semibold">Total</span>
          <span className="relative h-8 w-24 text-right text-[26px] font-bold tabular-nums tracking-[-0.02em]">
            {TOTALS.map((total, i) => (
              <span key={total} data-sp={`total${i}`} className={`absolute right-0 top-0 ${i ? 'invisible opacity-0' : ''}`}>
                ${total}
              </span>
            ))}
          </span>
        </p>
        <span className="flex h-12 items-center justify-center rounded-lg border border-[#c79a45]/50 text-[15px] font-semibold">Send to kitchen</span>
        <span className="relative mt-2.5 block h-12">
          <span data-sp="charge" className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#221b16] text-[15px] font-semibold text-[#f7f1e6]">
            Charge to room 204
          </span>
          <span data-sp="posted" className="invisible absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-[#4e7356] text-[15px] font-semibold text-white opacity-0">
            <Icon size={18}>{CHECK}</Icon> Posted to room 204
          </span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Scene 3: checkout

function DeskScene() {
  return (
    <div data-sp="scene2" className="invisible absolute inset-0 opacity-0">
      <div className="absolute left-7 top-6">
        <p className="text-[24px] font-semibold tracking-[-0.02em]">Front desk</p>
        <p className="mt-0.5 text-[14px] text-[#5c4f44]">Departures today · 2 of 6 checked out</p>
      </div>

      <div className="absolute left-7 top-[96px] w-[300px] rounded-2xl border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] p-5">
        <p className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c79a45]/20 text-[15px] font-bold text-[#7c5801]">HW</span>
          <span className="leading-tight">
            <span className="block text-[20px] font-bold tracking-[-0.01em]">Hannah Weber</span>
            <span className="text-[13px] text-[#5c4f44]">Room 204 · Junior Suite</span>
          </span>
        </p>
        <dl className="mt-5 space-y-2.5 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-[#5c4f44]">Stay</dt>
            <dd className="font-semibold">Thu 4 – Sun 7 Oct</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#5c4f44]">Booked on</dt>
            <dd className="flex items-center gap-2 font-semibold">
              <Logo id="booking" size={16} /> Booking.com
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#5c4f44]">Guests</dt>
            <dd className="font-semibold">2 adults</dd>
          </div>
        </dl>
        <p className="mt-5 rounded-lg bg-[#ede5d4] px-3 py-2.5 text-[13px] leading-snug text-[#5c4f44]">Asked for a late checkout and the window table at dinner.</p>
      </div>

      <div
        data-sp="hk"
        className="invisible absolute left-7 top-[420px] flex w-[300px] gap-3.5 rounded-2xl border border-[#4e7356]/40 bg-[#e3ebe2] p-5 text-[#36533d] opacity-0"
      >
        <Icon size={26} className="flex-none">
          {SPRAY()}
        </Icon>
        <p className="leading-snug">
          <span className="block text-[15px] font-bold">Room 204 sent to housekeeping</span>
          <span className="text-[13px]">Clean and inspect before 14:00</span>
        </p>
      </div>

      <div data-sp="folio" className="absolute left-[356px] right-7 top-[96px] flex h-[500px] flex-col rounded-2xl border border-[rgba(199,154,69,0.28)] bg-[#fbf7ef] p-6">
        <p className="flex items-center justify-between">
          <span className="text-[20px] font-bold tracking-[-0.01em]">Folio · Room 204</span>
          <span className="relative h-7 w-28 text-[13px] font-semibold">
            <span data-sp="open" className="absolute right-0 top-0 rounded-full bg-[#c79a45]/20 px-3 py-1 text-[#7c5801]">
              Open
            </span>
            <span data-sp="settled" className="invisible absolute right-0 top-0 rounded-full bg-[#4e7356] px-3 py-1 text-white opacity-0">
              Settled
            </span>
          </span>
        </p>
        <div className="mt-5 grid grid-cols-[96px_1fr_auto] border-b border-[rgba(199,154,69,0.28)] pb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#5c4f44]">
          <span>Date</span>
          <span>Item</span>
          <span>Amount</span>
        </div>
        {[
          ['Thu 4 Oct', 'Junior Suite, 3 nights', 540],
          ['Thu 4 Oct', 'Airport transfer', 35],
        ].map(([date, item, amount]) => (
          <div key={item} className="grid grid-cols-[96px_1fr_auto] items-center border-b border-[rgba(199,154,69,0.16)] py-3.5 text-[15px]">
            <span className="text-[#5c4f44]">{date}</span>
            <span>{item}</span>
            <span className="tabular-nums">${amount}</span>
          </div>
        ))}
        <div data-sp="folio-new" className="invisible -mx-2 grid grid-cols-[96px_1fr_auto] items-center rounded-lg border-b border-[rgba(199,154,69,0.16)] px-2 py-3 text-[15px] opacity-0">
          <span className="text-[#5c4f44]">Thu 4 Oct</span>
          <span className="leading-tight">
            Azure Bistro · Table 5
            <span className="block text-[12px] text-[#5c4f44]">From the restaurant till, 20:42</span>
          </span>
          <span className="tabular-nums">$82</span>
        </div>
        <p className="mt-auto flex items-baseline justify-between">
          <span className="text-[15px] font-semibold">Balance</span>
          <span className="relative h-9 w-28 text-right text-[30px] font-bold tabular-nums tracking-[-0.02em]">
            <span data-sp="bal0" className="absolute right-0 top-0">
              $575
            </span>
            <span data-sp="bal1" className="invisible absolute right-0 top-0 opacity-0">
              $657
            </span>
          </span>
        </p>
        <span className="relative mt-5 block h-12 w-[260px] self-end">
          <span data-sp="settle" className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#221b16] text-[15px] font-semibold text-[#f7f1e6]">
            Settle and check out
          </span>
          <span data-sp="paid" className="invisible absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-[#4e7356] text-[15px] font-semibold text-white opacity-0">
            <Icon size={18}>{CHECK}</Icon> Paid by card · checked out
          </span>
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- The app window

const TAGLINE = 'Smart Platform for Every Accommodation & Restaurant';
// The wordmark on the opening card. It shrinks into the app's top bar.
const CARD_MARK = { left: W / 2 - 260, top: 286, width: 520 };
const HEAD_MARK_W = 125;

const CLOCK = ['Thu 4 Oct · 14:20', 'Thu 4 Oct · 20:42', 'Sun 7 Oct · 11:05'];

function Window() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f7f1e6] font-['Manrope_Variable',system-ui,sans-serif] text-[14px] leading-[1.45] text-[#221b16]">
      <aside className="absolute bottom-0 left-0 top-0 w-16 border-r border-[rgba(199,154,69,0.28)] bg-[#ede5d4]">
        <img src="/products/spear-emblem.webp" alt="" width={36} height={36} className="absolute left-[14px] top-[14px] h-9 w-9" />
        <span
          data-sp="rail-mark"
          data-rail=""
          className="absolute left-2 h-12 w-12 rounded-lg border border-[rgba(199,154,69,0.28)] bg-[#f7f1e6] shadow-[0_2px_8px_rgba(34,27,22,0.06)]"
          style={{ top: RAIL_TOP, transform: `translateY(${SCENE_RAIL[0] * RAIL_STEP}px)` }}
        />
        {RAIL.map(({ key, icon }, i) => (
          <span
            key={key}
            data-sp={`rail-${key}`}
            data-rail=""
            className="absolute left-2 flex h-12 w-12 items-center justify-center"
            style={{ top: RAIL_TOP + i * RAIL_STEP, color: i === SCENE_RAIL[0] ? '#7c5801' : 'rgba(92,79,68,0.8)' }}
          >
            <Icon>{icon}</Icon>
            {key === 'housekeeping' ? <span data-sp="rail-dot" className="invisible absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#c79a45] opacity-0 ring-2 ring-[#ede5d4]" /> : null}
          </span>
        ))}
      </aside>

      <header data-sp="header" className="absolute left-16 right-0 top-0 flex h-14 items-center justify-between border-b border-[rgba(199,154,69,0.28)] bg-[#ede5d4]/70 px-6">
        <div className="leading-tight">
          <img data-sp="head-wordmark" src="/products/spear-wordmark.webp" alt="" width={1280} height={143} className="mb-1 block h-auto" style={{ width: HEAD_MARK_W }} />
          <p className="text-[12px] text-[#5c4f44]">The Grand Azure Hotel &amp; Bistro</p>
        </div>
        <div className="flex h-9 w-[300px] items-center gap-2 rounded-full border border-[rgba(199,154,69,0.28)] bg-[#f7f1e6] px-4 text-[13px] text-[#5c4f44]">
          <Icon size={15} className="text-[#7c5801]">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </Icon>
          Search guest, room, table or item
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <span className="relative h-5 w-[140px] text-right tabular-nums text-[#5c4f44]">
            {CLOCK.map((time, i) => (
              <span key={time} data-sp={`clock${i}`} className={`absolute right-0 top-0 whitespace-nowrap ${i ? 'invisible opacity-0' : ''}`}>
                {time}
              </span>
            ))}
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#c79a45]/50 bg-[#c79a45]/15 text-[12px] font-bold text-[#7c5801]">ML</span>
        </div>
      </header>

      <div className="absolute bottom-0 left-16 right-0 top-14">
        <RoomsScene />
        <TillScene />
        <DeskScene />
      </div>

      <div data-sp="cursor" className="pointer-events-none invisible absolute left-0 top-0 z-50 opacity-0">
        <span data-sp="ripple" className="absolute -left-6 -top-6 block h-12 w-12 rounded-full border-2 border-[#c79a45] opacity-0" />
        <svg width="30" height="34" viewBox="0 0 30 34" className="drop-shadow-[0_3px_6px_rgba(34,27,22,0.35)]">
          <path d="M2 2 L2 27 L8.5 21 L13 31 L17.5 29 L13 19.5 L22 19.5 Z" fill="#221b16" stroke="#fbf7ef" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>

      {/* The opening card. The wordmark shrinks from here into the top bar. */}
      <div data-sp="intro-bg" className="pointer-events-none absolute inset-0 z-40 bg-[#f7f1e6]">
        <p data-sp="tagline" className="absolute inset-x-0 top-[378px] text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-[#5c4f44]">
          {TAGLINE.split(' ').map((word, i) => (
            <span key={i}>
              {i > 0 ? ' ' : ''}
              {word === 'for' || word === '&' ? (
                word
              ) : (
                <>
                  <b className="font-bold text-[#7c5801]">{word[0]}</b>
                  {word.slice(1)}
                </>
              )}
            </span>
          ))}
        </p>
      </div>
      <img
        data-sp="wordmark"
        src="/products/spear-wordmark.webp"
        alt=""
        width={1280}
        height={143}
        className="pointer-events-none absolute z-[45] h-auto"
        style={{ ...CARD_MARK, transformOrigin: '0 0' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------- The film

// Camera shots for phones: the top-left corner and width of the region in view, in canvas pixels.
const SHOTS = {
  logo: { x: 220, y: 0, w: 600 },
  rail: { x: 0, y: 0, w: 600 },
  toast: { x: 520, y: 0, w: 520 },
  calendar: { x: 40, y: 96, w: 520 },
  menu: { x: 64, y: 16, w: 600 },
  ticket: { x: 520, y: 84, w: 520 },
  folio: { x: 410, y: 20, w: 610 },
  housekeeping: { x: 60, y: 108, w: 520 },
};
const FULL = { x: 0, y: 0, w: W };

function build(root, phone, onTime) {
  const q = (name) => root.querySelector(`[data-sp="${name}"]`);
  const canvas = root.querySelector('[data-canvas]');
  const cursor = q('cursor');
  const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: () => onTime(tl) });

  // Where an element sits on the canvas, ignoring transforms.
  const spot = (name, ax = 0.5, ay = 0.5) => {
    let el = q(name);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let x = 0;
    let y = 0;
    while (el && el !== canvas) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x: x + w * ax, y: y + h * ay };
  };
  const cam = (shot, at, duration = 1.1) => {
    if (phone) tl.to(canvas, { '--cx': shot.x, '--cy': shot.y, '--cw': shot.w, duration, ease: 'power3.inOut' }, at);
  };
  const show = (name, at, vars = {}) => tl.fromTo(q(name), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out', immediateRender: false, ...vars }, at);
  const swap = (from, to, at) => {
    tl.to(q(from), { autoAlpha: 0, y: -8, duration: 0.25, ease: 'power1.in' }, at);
    show(to, `${at}+=0.12`, { duration: 0.35 });
  };
  const wash = (name, at) =>
    tl.fromTo(q(name), { backgroundColor: 'rgba(199,154,69,0.24)' }, { backgroundColor: 'rgba(199,154,69,0)', duration: 1.4, ease: 'power2.out', immediateRender: false }, at);
  const move = (name, at, ax, ay) => tl.to(cursor, { x: () => spot(name, ax, ay).x, y: () => spot(name, ax, ay).y, duration: 0.8, ease: 'power3.inOut' }, at);
  const click = (name, at) => {
    tl.to(cursor, { scale: 0.86, duration: 0.1, ease: 'power1.in' }, at)
      .to(cursor, { scale: 1, duration: 0.18, ease: 'power1.out' }, `${at}+=0.1`)
      .fromTo(q('ripple'), { scale: 0.4, opacity: 0.9 }, { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, at);
    if (name) tl.to(q(name), { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, at);
  };
  const changeScene = (from, to, at) => {
    tl.to(q(`scene${from}`), { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, at)
      .fromTo(q(`scene${to}`), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, `${at}+=0.3`)
      .to(q('rail-mark'), { y: SCENE_RAIL[to] * RAIL_STEP, duration: 0.6, ease: 'power3.inOut' }, at)
      .to(q(`rail-${RAIL[SCENE_RAIL[from]].key}`), { color: 'rgba(92,79,68,0.8)', duration: 0.4 }, at)
      .to(q(`rail-${RAIL[SCENE_RAIL[to]].key}`), { color: '#7c5801', duration: 0.4 }, `${at}+=0.2`);
    swap(`clock${from}`, `clock${to}`, at);
  };

  // Scene 1: a Booking.com booking lands on the calendar.
  tl.addLabel('s0', 0);
  const card = [q('wordmark'), q('tagline')];
  tl.fromTo(card, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, 0);
  tl.fromTo(q('intro-bg'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, 0.2);
  if (phone) tl.set(canvas, { '--cx': SHOTS.toast.x, '--cy': SHOTS.toast.y, '--cw': SHOTS.toast.w }, 0.2);
  tl.fromTo(q('toast'), { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)', immediateRender: false }, 0.7);
  cam(SHOTS.calendar, 2.3);
  wash('row204', 2.9);
  tl.fromTo(q('new-stay'), { autoAlpha: 0, scaleX: 0.15 }, { autoAlpha: 1, scaleX: 1, duration: 0.8, ease: 'power3.out', immediateRender: false }, 3.0);
  swap('let0', 'let1', 3.4);
  tl.to(q('toast'), { autoAlpha: 0, y: -12, duration: 0.4, ease: 'power1.in' }, 4.4);
  tl.addLabel('s0hold', 4.0);

  // Scene 2: dinner at the bistro is charged to her room.
  const t1 = 6.2;
  tl.addLabel('s1', t1);
  changeScene(0, 1, t1);
  cam(SHOTS.menu, t1, 0.9);
  tl.set(cursor, { x: () => spot('ticket', 0.2, 0.9).x - 300, y: () => spot('ticket', 0.2, 0.9).y }, t1);
  tl.to(cursor, { autoAlpha: 1, duration: 0.3 }, t1 + 0.8);
  ORDER.forEach((dish, i) => {
    const at = t1 + 1.0 + i * 1.15;
    move(`dish${dish}`, at, 0.55, 0.45);
    click(`dish${dish}`, at + 0.8);
    show(`line${i}`, at + 0.9);
    swap(`total${i}`, `total${i + 1}`, at + 0.9);
  });
  const t1b = t1 + 1.0 + ORDER.length * 1.15;
  cam(SHOTS.ticket, t1b - 0.1);
  move('charge', t1b, 0.5, 0.5);
  click('charge', t1b + 0.85);
  swap('charge', 'posted', t1b + 0.95);
  tl.addLabel('s1hold', t1b + 1.2);
  tl.to(cursor, { autoAlpha: 0, duration: 0.3 }, t1b + 2.0);

  // Scene 3: the dinner is already on the bill; one payment and the room goes to be cleaned.
  const t2 = t1b + 2.6;
  tl.addLabel('s2', t2);
  changeScene(1, 2, t2);
  cam(SHOTS.folio, t2, 0.9);
  tl.fromTo(q('folio-new'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', immediateRender: false }, t2 + 1.1);
  wash('folio-new', t2 + 1.2);
  swap('bal0', 'bal1', t2 + 1.4);
  tl.set(cursor, { x: () => spot('settle').x - 200, y: () => spot('settle').y - 140 }, t2 + 1.6);
  tl.to(cursor, { autoAlpha: 1, duration: 0.3 }, t2 + 2.0);
  move('settle', t2 + 2.1, 0.55, 0.5);
  click('settle', t2 + 2.95);
  swap('settle', 'paid', t2 + 3.05);
  swap('open', 'settled', t2 + 3.15);
  tl.to(cursor, { autoAlpha: 0, duration: 0.3 }, t2 + 3.6);
  cam(SHOTS.housekeeping, t2 + 3.6);
  show('hk', t2 + 4.2, { y: 0, x: 0, scale: 1 });
  tl.fromTo(q('rail-dot'), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, t2 + 4.4);
  tl.addLabel('s2hold', t2 + 4.8);
  // Back to the card for a moment before the next round.
  const end = t2 + 7.2;
  tl.set(q('wordmark'), { x: 0, y: 0, scale: 1, autoAlpha: 0 }, end);
  tl.set(q('tagline'), { y: 0, autoAlpha: 0 }, end);
  tl.fromTo(q('intro-bg'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: 'power1.in', immediateRender: false }, end);
  if (phone) tl.set(canvas, { '--cx': SHOTS.logo.x, '--cy': SHOTS.logo.y, '--cw': SHOTS.logo.w }, end + 0.5);
  tl.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.08, ease: 'power1.out', immediateRender: false }, end + 0.55);
  tl.set({}, {}, end + 2.2);
  if (!phone) tl.set(canvas, FULL_VARS, 0);
  return tl;
}
const FULL_VARS = { '--cx': FULL.x, '--cy': FULL.y, '--cw': FULL.w };
const shotVars = (shot) => ({ '--cx': shot.x, '--cy': shot.y, '--cw': shot.w });

// The top-left corner of an element on the canvas, ignoring transforms.
function spot(root, el) {
  const canvas = root.querySelector('[data-canvas]');
  let x = 0;
  let y = 0;
  while (el && el !== canvas) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  }
  return { x, y };
}

// Where the first round starts after the opening, past the card fading out.
const FILM_START = 0.7;

// The opening, played once when the preview first comes into view: the logo card, then the wordmark
// shrinks into the top bar and the app builds up around it.
function buildIntro(root, phone, done, onComplete) {
  const q = (name) => root.querySelector(`[data-sp="${name}"]`);
  const canvas = root.querySelector('[data-canvas]');
  const rail = root.querySelectorAll('[data-rail]');
  if (done) {
    gsap.set([q('intro-bg'), q('wordmark')], { autoAlpha: 0 });
    if (phone) gsap.set(canvas, shotVars(SHOTS.toast));
    return null;
  }
  gsap.set(q('head-wordmark'), { autoAlpha: 0 });
  const slot = () => spot(root, q('head-wordmark'));
  if (phone) gsap.set(canvas, shotVars(SHOTS.logo));
  const tl = gsap.timeline({ paused: true, onComplete });
  tl.to(q('tagline'), { autoAlpha: 0, y: 10, duration: 0.35, ease: 'power1.in' }, 1.0)
    .to(q('wordmark'), { x: () => slot().x - CARD_MARK.left, y: () => slot().y - CARD_MARK.top, scale: HEAD_MARK_W / CARD_MARK.width, duration: 1.0, ease: 'power3.inOut' }, 1.1)
    .to(q('intro-bg'), { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 1.6)
    .fromTo(q('header'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, 1.6)
    .fromTo(rail, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', immediateRender: false }, 1.7)
    .fromTo(q('scene0'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, 1.8)
    .set(q('head-wordmark'), { autoAlpha: 1 }, 2.1)
    .set(q('wordmark'), { autoAlpha: 0 }, 2.1);
  if (phone) {
    tl.to(canvas, { ...shotVars(SHOTS.rail), duration: 0.9, ease: 'power3.inOut' }, 1.2);
    tl.to(canvas, { ...shotVars(SHOTS.toast), duration: 0.9, ease: 'power3.inOut' }, 2.2);
  }
  return tl;
}

export default function SpearPreview({ className = '' }) {
  const root = useRef(null);
  const box = useRef(null);
  const film = useRef(null);
  const intro = useRef(null);
  const bars = useRef([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const state = useRef({ active: 0, visible: false, seen: false, introDone: false, paused: false, still: false });

  // Scale the drawing to the width it is given.
  useLayoutEffect(() => {
    const outer = box.current;
    const canvas = outer.querySelector('[data-canvas]');
    const fit = () => canvas.style.setProperty('--bw', String(outer.clientWidth));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  const sync = () => {
    const tl = film.current;
    if (!tl) return;
    const { visible, seen, introDone, paused: held, still: frozen } = state.current;
    if (!introDone && intro.current) {
      tl.pause();
      intro.current.paused(held || !visible || !seen);
      return;
    }
    tl.paused(held || frozen || !visible);
  };

  useGSAP(
    () => {
      const onTime = (tl) => {
        const starts = [tl.labels.s0, tl.labels.s1, tl.labels.s2, tl.duration()];
        const t = tl.time();
        const index = t >= starts[2] ? 2 : t >= starts[1] ? 1 : 0;
        bars.current.forEach((bar, i) => {
          if (!bar) return;
          const p = i < index ? 1 : i > index ? 0 : (t - starts[i]) / (starts[i + 1] - starts[i]);
          bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
        });
        if (index !== state.current.active) {
          state.current.active = index;
          setActive(index);
        }
      };
      const mm = gsap.matchMedia();
      mm.add({ phone: PHONE, desktop: `not all and ${PHONE}`, reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
        const { phone, reduce } = context.conditions;
        const tl = build(root.current, phone, onTime);
        film.current = tl;
        state.current.still = reduce;
        setStill(reduce);
        if (reduce) state.current.introDone = true;
        intro.current = buildIntro(root.current, phone, state.current.introDone, () => {
          state.current.introDone = true;
          intro.current = null;
          tl.seek(FILM_START, false);
          sync();
        });
        if (reduce) tl.seek('s0hold', false);
        else if (state.current.introDone) tl.seek(FILM_START, false);
        sync();
        return () => {
          film.current = null;
          intro.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Play only while on screen.
  useLayoutEffect(() => {
    // The opening waits until a third of the preview is in view, so a quick scroll still catches it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        state.current.visible = entry.isIntersecting;
        if (entry.intersectionRatio >= 0.35) state.current.seen = true;
        sync();
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    state.current.paused = !state.current.paused;
    setPaused(state.current.paused);
    sync();
  };
  const jump = (index) => {
    const tl = film.current;
    if (!tl) return;
    if (intro.current) intro.current.progress(1);
    if (state.current.still || state.current.paused) tl.seek(`s${index}hold`, false);
    else tl.seek(`s${index}`, false);
  };

  return (
    <div ref={root} className={`w-full ${className}`}>
      <div
        ref={box}
        role="img"
        aria-label="Spear OS at work: a Booking.com booking lands on the room calendar, the guest’s dinner at the bistro is charged to her room, and at checkout it is already on her bill."
        className="relative aspect-[1040/680] w-full overflow-hidden rounded-xl bg-[#ede5d4] shadow-[0_30px_60px_-30px_rgba(34,27,22,0.45)] ring-1 ring-black/10 max-sm:aspect-[1/1.1]"
      >
        <div
          data-canvas=""
          aria-hidden="true"
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: W,
            height: H,
            '--bw': 560,
            '--cx': 0,
            '--cy': 0,
            '--cw': W,
            transform: 'translate(calc(var(--cx) * var(--bw) / var(--cw) * -1px), calc(var(--cy) * var(--bw) / var(--cw) * -1px)) scale(calc(var(--bw) / var(--cw)))',
          }}
        >
          <Window />
        </div>
      </div>

      <div className="mt-4 flex items-stretch gap-2">
        {still ? null : (
          <button
            type="button"
            onClick={toggle}
            aria-label={paused ? 'Play the demo' : 'Pause the demo'}
            className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-gray-300 bg-white text-black transition-[transform,border-color] duration-150 hover:border-black active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {paused ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1.5v11L12.5 7z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
        <ol className="grid flex-1 grid-cols-3 gap-2">
          {SCENES.map((scene, i) => (
            <li key={scene.title}>
              <button
                type="button"
                onClick={() => jump(i)}
                aria-current={active === i ? 'step' : undefined}
                className={`group relative flex h-full min-h-11 w-full flex-col justify-center overflow-hidden border-t-2 pt-2 text-left font-mono text-[11px] uppercase leading-tight tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                  active === i ? 'border-gray-300 text-black' : 'border-gray-300 text-gray-500 hover:text-black'
                }`}
              >
                <span
                  ref={(el) => {
                    bars.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-[-2px] h-0.5 origin-left bg-black"
                  style={{ transform: 'scaleX(0)' }}
                />
                <span>
                  {String(i + 1).padStart(2, '0')} <span className="max-sm:sr-only">{scene.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-3 min-h-[3em] text-sm leading-relaxed text-gray-600">
        <span className="font-semibold text-black sm:hidden">{SCENES[active].title}. </span>
        {SCENES[active].line}
      </p>
    </div>
  );
}
