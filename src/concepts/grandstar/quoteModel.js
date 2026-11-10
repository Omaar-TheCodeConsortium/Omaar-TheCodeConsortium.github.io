// Budgetary pricing model behind the Instant quote page. Pure functions, no React.
// The numbers are invented but behave like a real shop's: tooling scales with size, complexity and
// cavities; moulded unit cost with material, press size and cycle time; printing with part volume.

export const QUOTE_PROCESSES = [
  { id: 'im', name: 'Injection moulding', kind: 'moulding', hint: 'Needs a mould. Cheapest per part in volume.' },
  { id: 'sls', name: 'SLS nylon', kind: 'printing', hint: 'No tooling. Strong functional parts.' },
  { id: 'mjf', name: 'MJF nylon', kind: 'printing', hint: 'No tooling. Best for end-use batches.' },
  { id: 'sla', name: 'SLA resin', kind: 'printing', hint: 'No tooling. Smoothest surface.' },
];

// pricePerKg in USD, density in g/cm³, cool: relative cooling time.
export const MOULDING_MATERIALS = [
  { id: 'abs', name: 'ABS', pricePerKg: 2.1, density: 1.05, cool: 1.0, maxWall: 4 },
  { id: 'pp', name: 'PP', pricePerKg: 1.45, density: 0.9, cool: 1.15, maxWall: 4 },
  { id: 'pc', name: 'PC', pricePerKg: 3.4, density: 1.2, cool: 1.1, maxWall: 4.5 },
  { id: 'pc-abs', name: 'PC/ABS', pricePerKg: 3.1, density: 1.13, cool: 1.05, maxWall: 4 },
  { id: 'pa66-gf30', name: 'PA66 GF30', pricePerKg: 4.2, density: 1.37, cool: 0.85, maxWall: 5, abrasive: true },
  { id: 'pom', name: 'POM', pricePerKg: 2.6, density: 1.41, cool: 1.2, maxWall: 3.5 },
  { id: 'tpu', name: 'TPU 85A', pricePerKg: 4.8, density: 1.12, cool: 1.35, maxWall: 5 },
];

// perCm3: price per cm³ of part; perBoxCm3: price per cm³ of bounding box (machine space);
// boxPerDay: bounding-box volume we can print per working day.
export const PRINT_MATERIALS = {
  sls: { name: 'PA12', perCm3: 0.38, perBoxCm3: 0.016, boxPerDay: 26000 },
  mjf: { name: 'PA12', perCm3: 0.33, perBoxCm3: 0.014, boxPerDay: 34000 },
  sla: { name: 'ABS-like resin', perCm3: 0.29, perBoxCm3: 0.01, boxPerDay: 18000 },
};

export const COMPLEXITY = [
  { id: 'simple', name: 'Straight pull', hint: 'No undercuts', tool: 1, days: 15 },
  { id: 'medium', name: 'One or two slides', hint: 'Side holes, clips, lifters', tool: 1.55, days: 20 },
  { id: 'complex', name: 'Three or more actions', hint: 'Multiple slides, threads, collapsing cores', tool: 2.3, days: 28 },
];

export const CAVITIES = [
  { n: 1, tool: 1 },
  { n: 2, tool: 1.6 },
  { n: 4, tool: 2.5 },
  { n: 8, tool: 4.1 },
];

export const FINISHES = [
  { id: 'c1', name: 'SPI C-1, stone finish', hint: 'Matte, hides flow lines', tool: 1, part: 0 },
  { id: 'b2', name: 'SPI B-2, fine paper', hint: 'Satin', tool: 1.08, part: 0 },
  { id: 'a2', name: 'SPI A-2, diamond polish', hint: 'High gloss', tool: 1.2, part: 0.02 },
  { id: 'tex', name: 'VDI 27 texture', hint: 'Etched grain', tool: 1.14, part: 0 },
];

export const PRESS_SIZES = [50, 90, 130, 180, 250, 350, 470, 650, 850];

export const LIMITS = {
  length: { min: 10, max: 900, step: 1 },
  width: { min: 10, max: 600, step: 1 },
  height: { min: 2, max: 300, step: 1 },
  wall: { min: 0.6, max: 6, step: 0.1 },
  quantity: { min: 1, max: 200000 },
};

export const DEFAULT_INPUT = {
  process: 'im',
  material: 'abs',
  length: 120,
  width: 80,
  height: 30,
  wall: 2,
  complexity: 'medium',
  cavities: 1,
  finish: 'c1',
  quantity: 5000,
};

const MARGIN = 1.24;
const SETUP_PER_BATCH = 160;
const HOURS_PER_DAY = 20;
const P20_SHOT_LIFE = 300000;

const round = (value, places = 2) => Number(value.toFixed(places));

// An open five-sided shell with ribs and bosses, capped at the solid block.
export function partVolumeCm3({ length, width, height, wall }) {
  const area = length * width + 2 * height * (length + width); // mm²
  const shell = (area * wall * 1.25) / 1000;
  const solid = (length * width * height) / 1000;
  return Math.min(shell, solid);
}

function mouldingQuote(input) {
  const material = MOULDING_MATERIALS.find((m) => m.id === input.material) ?? MOULDING_MATERIALS[0];
  const complexity = COMPLEXITY.find((c) => c.id === input.complexity) ?? COMPLEXITY[0];
  const cavity = CAVITIES.find((c) => c.n === input.cavities) ?? CAVITIES[0];
  const finish = FINISHES.find((f) => f.id === input.finish) ?? FINISHES[0];

  const volume = partVolumeCm3(input);
  const projectedCm2 = (input.length * input.width) / 100;
  const tonnageNeeded = projectedCm2 * 0.31 * cavity.n * 1.1;
  const press = PRESS_SIZES.find((size) => size >= tonnageNeeded) ?? null;

  const shots = Math.ceil(input.quantity / cavity.n);
  const hardened = Boolean(material.abrasive) || shots > P20_SHOT_LIFE;
  const steel = hardened ? 'H13, hardened' : 'P20, pre-hardened';

  const tooling =
    (1800 + projectedCm2 * 24 + input.height * 15) * complexity.tool * cavity.tool * finish.tool * (hardened ? 1.35 : 1);

  const cycleSeconds = 9 + 3.2 * input.wall ** 2 * material.cool + input.height * 0.03;
  const partsPerHour = (3600 / cycleSeconds) * cavity.n;
  const pressRate = 9 + (press ?? 850) * 0.055;

  const materialCost = ((volume * material.density) / 1000) * material.pricePerKg * 1.06;
  const machineCost = pressRate / partsPerHour;
  const unitBase = (materialCost + machineCost + 0.04 + finish.part) * MARGIN;
  const unitPrice = unitBase + SETUP_PER_BATCH / input.quantity;

  const toolDays = complexity.days + (projectedCm2 > 300 ? 3 : 0) + (cavity.n >= 4 ? 4 : 0) + (hardened ? 5 : 0);
  const productionDays = Math.ceil(input.quantity / (partsPerHour * HOURS_PER_DAY)) + 3;

  return {
    kind: 'moulding',
    feasible: press !== null,
    materialName: material.name,
    volume: round(volume, 1),
    weightG: round(volume * material.density, 1),
    tooling: Math.round(tooling / 10) * 10,
    unitPrice: round(unitPrice, unitPrice < 1 ? 3 : 2),
    unitBase,
    press,
    tonnageNeeded: Math.ceil(tonnageNeeded),
    steel,
    cycleSeconds: round(cycleSeconds, 1),
    toolDays,
    productionDays,
    leadDays: toolDays + productionDays,
    material,
  };
}

function printQuote(input, processId = input.process) {
  const spec = PRINT_MATERIALS[processId];
  const volume = partVolumeCm3(input);
  const boxCm3 = (input.length * input.width * input.height) / 1000;
  const single = volume * spec.perCm3 + boxCm3 * spec.perBoxCm3 + 4;
  const discount = 0.62 + 0.38 * input.quantity ** -0.4;
  const unitPrice = Math.max(single * discount, 45 / input.quantity);
  const perDay = Math.max(1, Math.floor(spec.boxPerDay / Math.max(boxCm3, 1)));

  return {
    kind: 'printing',
    feasible: true,
    materialName: spec.name,
    volume: round(volume, 1),
    weightG: round(volume * 1.0, 1),
    tooling: 0,
    unitPrice: round(unitPrice, 2),
    leadDays: 3 + Math.ceil(input.quantity / perDay),
    partsPerDay: perDay,
  };
}

export function quote(input) {
  const process = QUOTE_PROCESSES.find((p) => p.id === input.process) ?? QUOTE_PROCESSES[0];
  return process.kind === 'moulding' ? mouldingQuote(input) : printQuote(input);
}

// Cost per part at a given quantity for each route, with tooling spread across the order.
export function costPerPart(input, quantity) {
  const at = { ...input, quantity };
  const moulding = mouldingQuote({ ...at, process: 'im' });
  const printProcess = input.process === 'im' ? 'sls' : input.process;
  const printing = printQuote(at, printProcess);
  return {
    moulding: moulding.feasible ? moulding.unitPrice + moulding.tooling / quantity : null,
    printing: printing.unitPrice,
    printProcess,
  };
}

// Sample points on a log scale from 1 to 200,000 for the chart.
export function costCurve(input, points = 60) {
  const { min, max } = LIMITS.quantity;
  return Array.from({ length: points }, (_, index) => {
    const quantity = Math.round(min * (max / min) ** (index / (points - 1)));
    return { quantity, ...costPerPart(input, quantity) };
  });
}

// Smallest quantity at which moulding (tooling included) is cheaper per part than printing.
export function crossover(input) {
  const { max } = LIMITS.quantity;
  let low = 1;
  let high = max;
  const cheaper = (quantity) => {
    const cost = costPerPart(input, quantity);
    return cost.moulding !== null && cost.moulding < cost.printing;
  };
  if (!cheaper(high)) return null;
  if (cheaper(low)) return 1;
  while (high - low > 1) {
    const mid = Math.floor((low + high) / 2);
    if (cheaper(mid)) high = mid;
    else low = mid;
  }
  return high;
}

// Design-for-manufacture notes that react to the inputs, the way a real DFM review would.
export function dfmNotes(input, result) {
  const notes = [];
  if (result.kind === 'moulding') {
    if (!result.feasible) {
      notes.push({
        level: 'stop',
        text: `This layout needs about ${result.tonnageNeeded} t of clamping force, more than our largest press (850 t). Reduce the cavity count or the part footprint.`,
      });
    }
    if (input.wall > result.material.maxWall) {
      notes.push({
        level: 'warn',
        text: `Walls above ${result.material.maxWall} mm in ${result.materialName} tend to sink and void. Core out thick sections to 2–3 mm with ribs.`,
      });
    }
    if (input.wall < 0.8) {
      notes.push({ level: 'warn', text: 'Below 0.8 mm we run a fill simulation before quoting formally. Long thin walls may not fill.' });
    }
    if (input.length / input.wall > 220) {
      notes.push({ level: 'warn', text: 'Flow length is long for this wall thickness. Expect more than one gate, or a hot runner.' });
    }
    if (result.material.abrasive) {
      notes.push({ level: 'info', text: 'Glass-filled resin wears soft steel, so this tool is priced in hardened H13.' });
    }
    if (input.quantity < 500) {
      notes.push({ level: 'info', text: 'Our minimum moulding order is 500 pieces. Below that, printing is usually the better route.' });
    }
    if (input.height > 80 && input.complexity === 'simple') {
      notes.push({ level: 'info', text: 'Deep parts need at least 1.5° of draft per side to eject cleanly without drag marks.' });
    }
  } else {
    if (input.length > 600 || input.width > 340) {
      notes.push({ level: 'warn', text: 'Larger than one build chamber. We would print it in sections and bond them, which adds two days.' });
    }
    if (input.wall < 0.8) {
      notes.push({ level: 'warn', text: 'Printed walls below 0.8 mm are fragile and may warp. 1.0 mm or more is safer.' });
    }
    if (input.quantity > 2000) {
      notes.push({ level: 'info', text: 'At this quantity a mould almost always pays for itself. Compare the two curves on the chart.' });
    }
  }
  return notes;
}

export const formatUsd = (value, places) => {
  const digits = places ?? (value < 1 ? 3 : value < 100 ? 2 : 0);
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

export const formatInt = (value) => Math.round(value).toLocaleString('en-US');
