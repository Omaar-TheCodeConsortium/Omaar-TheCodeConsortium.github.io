// Mock content for Grandstar Precision. Everything here is invented: the company, its plant,
// its people and its figures. Material properties are typical published values for each grade.

export const HEADLINE_FIGURES = [
  { value: '34', unit: 'presses', note: '50 to 850 tonnes clamping force' },
  { value: '±0.02', unit: 'mm', note: 'cavity and core steel tolerance' },
  { value: '15', unit: 'working days', note: 'to T1 samples on a single-cavity P20 tool' },
  { value: '312', unit: 'PPM', note: 'customer returns across 2025 shipments' },
];

// A typical programme for a single-cavity tool, in working days from order.
export const PROGRAMME = [
  { phase: 'DFM review', start: 0, end: 2, detail: 'Draft, wall, gate and ejection report returned for sign-off' },
  { phase: 'Tool design', start: 2, end: 5, detail: '3D tool design and steel order' },
  { phase: 'Machining', start: 5, end: 12, detail: 'CNC roughing, heat treatment where specified, finishing, EDM' },
  { phase: 'Fit and polish', start: 12, end: 14, detail: 'Bench fitting, spotting, surface finish' },
  { phase: 'T1 trial', start: 14, end: 15, detail: 'First shots, dimensional report, samples shipped by air' },
  { phase: 'Your approval', start: 15, end: 20, detail: 'Samples in transit and with your engineers', customer: true },
  { phase: 'Corrections', start: 20, end: 23, detail: 'T2 if dimensions or cosmetics need adjusting' },
  { phase: 'First production', start: 23, end: 29, detail: 'Moulding, in-process checks, packing' },
  { phase: 'FOB Shenzhen', start: 29, end: 30, detail: 'Outgoing inspection and delivery to Yantian port' },
];
export const PROGRAMME_DAYS = 30;

export const PROCESSES = [
  {
    id: 'moulding',
    name: 'Injection moulding',
    scale: '500 to 2,000,000 parts',
    lead: '15 working days to T1',
    summary:
      'Thermoplastic moulding on 34 presses, including two-shot, insert and overmoulding, in a 100,000-class clean cell for medical and optical parts.',
  },
  {
    id: 'tooling',
    name: 'Mould making',
    scale: 'SPI class 101 to 104',
    lead: 'Up to 32 cavities',
    summary:
      'Tools designed and cut in our own tool room: prototype aluminium, P20 pre-hardened and hardened H13 or S136 production moulds, for our presses or for export.',
  },
  {
    id: 'printing',
    name: '3D printing',
    scale: '1 to 2,000 parts',
    lead: 'Ships in 3 working days',
    summary:
      'SLS and MJF nylon for functional parts and SLA resin for fit and appearance models, used for bridge production while a mould is being made.',
  },
];

export const INDUSTRIES = [
  { name: 'E-mobility', parts: 'Controller housings, battery cell holders, display bezels' },
  { name: 'Medical devices', parts: 'Inhaler bodies, diagnostic cartridge shells, pump housings' },
  { name: 'Consumer electronics', parts: 'Router enclosures, wearable casings, charger shells' },
  { name: 'Power tools', parts: 'Two-shot grips, gear housings, battery pack cases' },
  { name: 'Automotive interior', parts: 'Vent bezels, switch carriers, clips and fasteners' },
  { name: 'Home appliances', parts: 'Coffee machine panels, vacuum ducts, water tank lids' },
];

export const PRESSES = [
  { range: '50 to 90 t', count: 8, shot: '45 to 130 g', makes: 'Sumitomo Demag, Haitian', notes: 'All-electric, connectors and small gears' },
  { range: '120 to 180 t', count: 11, shot: '160 to 340 g', makes: 'Haitian, Engel', notes: 'Six in the clean cell' },
  { range: '220 to 350 t', count: 9, shot: '420 to 1,150 g', makes: 'Haitian, Engel', notes: 'Two with rotary platen for two-shot' },
  { range: '470 to 650 t', count: 4, shot: '1,600 to 3,100 g', makes: 'Haitian', notes: 'Appliance panels and battery cases' },
  { range: '850 t', count: 2, shot: '4,800 g', makes: 'Haitian', notes: 'Largest part to date: 1,120 × 640 mm' },
];

export const MOULD_CLASSES = [
  { cls: 'SPI 104', steel: 'Aluminium 7075 or P20', life: 'Up to 100,000 shots', use: 'Prototype and bridge tools' },
  { cls: 'SPI 103', steel: 'P20, 718H', life: 'Up to 500,000 shots', use: 'Most consumer and industrial parts' },
  { cls: 'SPI 102', steel: 'H13, NAK80', life: 'Up to 1,000,000 shots', use: 'Glass-filled resins, high-gloss surfaces' },
  { cls: 'SPI 101', steel: 'H13, S136 hardened to 48–52 HRC', life: 'Over 1,000,000 shots', use: 'Medical, packaging, multi-cavity' },
];

export const PRINTERS = [
  { process: 'SLS', material: 'PA12, PA12 glass-filled', volume: '340 × 340 × 600 mm', layer: '0.10 mm', tolerance: '±0.3% (min ±0.3 mm)' },
  { process: 'MJF', material: 'PA12, PA11', volume: '380 × 284 × 380 mm', layer: '0.08 mm', tolerance: '±0.3% (min ±0.2 mm)' },
  { process: 'SLA', material: 'ABS-like and clear resins', volume: '800 × 800 × 550 mm', layer: '0.05 to 0.10 mm', tolerance: '±0.2% (min ±0.1 mm)' },
];

export const SECONDARY_OPS = [
  'Ultrasonic and hot-plate welding',
  'Pad and screen printing',
  'Laser marking',
  'Painting and UV coating (approved partner, 4 km away)',
  'Heat staking and threaded inserts',
  'Sub-assembly, functional test and retail packing',
];

export const EQUIPMENT = [
  { dept: 'Tool room', item: '5-axis machining centre', make: 'DMG Mori DMU 65', qty: 2, spec: '±0.005 mm positioning' },
  { dept: 'Tool room', item: '3-axis high-speed mill', make: 'Makino V33i', qty: 6, spec: '30,000 rpm, graphite and hard steel' },
  { dept: 'Tool room', item: 'Sinker EDM', make: 'Sodick AG60L', qty: 5, spec: 'Mirror finish to Ra 0.1 µm' },
  { dept: 'Tool room', item: 'Wire EDM', make: 'Sodick ALN400G', qty: 4, spec: '±0.003 mm' },
  { dept: 'Tool room', item: 'Deep-hole drill', make: 'Local build', qty: 1, spec: 'Cooling channels to 1,200 mm' },
  { dept: 'Tool room', item: 'Spotting press', make: 'Millutensil', qty: 1, spec: '200 t, tools to 6 t' },
  { dept: 'Moulding', item: 'Injection press, 50 to 850 t', make: 'Haitian, Engel, Sumitomo Demag', qty: 34, spec: 'See press list' },
  { dept: 'Moulding', item: 'Six-axis part-removal robot', make: 'ABB, Yushin', qty: 19, spec: 'On every press above 180 t' },
  { dept: 'Moulding', item: 'Desiccant dryer', make: 'Motan', qty: 14, spec: 'Dew point −40 °C' },
  { dept: 'Moulding', item: 'Mould temperature controller', make: 'HB-Therm', qty: 22, spec: 'Water to 160 °C' },
  { dept: 'Printing', item: 'SLS printer', make: 'EOS P 396', qty: 2, spec: '340 × 340 × 600 mm' },
  { dept: 'Printing', item: 'MJF printer', make: 'HP Jet Fusion 5200', qty: 1, spec: '380 × 284 × 380 mm' },
  { dept: 'Printing', item: 'SLA printer', make: 'UnionTech RSPro 800', qty: 3, spec: '800 × 800 × 550 mm' },
  { dept: 'Metrology', item: 'Bridge CMM', make: 'Zeiss Contura', qty: 2, spec: '1.5 + L/350 µm' },
  { dept: 'Metrology', item: 'Vision measuring machine', make: 'Mitutoyo Quick Vision', qty: 3, spec: '2 + 3L/1000 µm' },
  { dept: 'Metrology', item: 'Blue-light 3D scanner', make: 'GOM ATOS Q', qty: 1, spec: 'Full-part colour deviation maps' },
  { dept: 'Metrology', item: 'Melt flow indexer', make: 'Zwick', qty: 1, spec: 'Incoming resin verification' },
  { dept: 'Metrology', item: 'Moisture analyser', make: 'Brabender Aquatrac', qty: 2, spec: 'Residual moisture before moulding' },
];

export const EQUIPMENT_DEPTS = ['All', 'Tool room', 'Moulding', 'Printing', 'Metrology'];

// Typical values: tensile strength at yield (MPa), heat deflection temperature at 1.8 MPa (°C),
// mould shrinkage (%), density (g/cm³). `process` is 'Moulding' or 'Printing'.
export const MATERIALS = [
  { id: 'abs', name: 'ABS', grade: 'Chi Mei Polylac PA-757', family: 'Commodity', process: 'Moulding', tensile: 46, hdt: 84, shrink: '0.4–0.7', density: 1.05, flame: 'HB', stock: true, uses: 'Enclosures, appliance panels, toys', note: 'Easy to mould, paint and plate. Poor UV resistance outdoors without a cap layer.' },
  { id: 'pp-h', name: 'PP homopolymer', grade: 'Sinopec T30S', family: 'Commodity', process: 'Moulding', tensile: 34, hdt: 55, shrink: '1.2–2.0', density: 0.9, flame: 'HB', stock: true, uses: 'Caps, containers, living hinges', note: 'High shrinkage: flatness on large panels needs ribs and balanced cooling.' },
  { id: 'pp-c', name: 'PP copolymer', grade: 'LyondellBasell Moplen EP548S', family: 'Commodity', process: 'Moulding', tensile: 26, hdt: 50, shrink: '1.2–2.0', density: 0.9, flame: 'HB', stock: true, uses: 'Crates, automotive trim, housewares', note: 'Better low-temperature impact than homopolymer.' },
  { id: 'hdpe', name: 'HDPE', grade: 'Sabic M80064', family: 'Commodity', process: 'Moulding', tensile: 26, hdt: 44, shrink: '1.5–3.0', density: 0.96, flame: 'HB', stock: false, uses: 'Closures, chemical containers', note: 'Ordered per job, allow 7 days.' },
  { id: 'pmma', name: 'PMMA', grade: 'Mitsubishi Acrypet VH001', family: 'Commodity', process: 'Moulding', tensile: 72, hdt: 95, shrink: '0.2–0.6', density: 1.19, flame: 'HB', stock: true, uses: 'Light guides, lenses, display windows', note: 'Run in the clean cell for optical parts. Brittle at sharp corners.' },
  { id: 'pc', name: 'PC', grade: 'Covestro Makrolon 2407', family: 'Engineering', process: 'Moulding', tensile: 66, hdt: 124, shrink: '0.5–0.7', density: 1.2, flame: 'V-2', stock: true, uses: 'Clear covers, safety housings', note: 'Must be dried to below 0.02% moisture. Stress-cracks with some solvents and greases.' },
  { id: 'pc-abs', name: 'PC/ABS', grade: 'Covestro Bayblend T65 XF', family: 'Engineering', process: 'Moulding', tensile: 54, hdt: 109, shrink: '0.5–0.7', density: 1.13, flame: 'HB', stock: true, uses: 'Electronics housings, automotive interior', note: 'Flame-retardant FR3010 grade also stocked (V-0 at 1.5 mm).' },
  { id: 'pa6', name: 'PA6', grade: 'BASF Ultramid B3S', family: 'Engineering', process: 'Moulding', tensile: 80, hdt: 65, shrink: '0.8–1.5', density: 1.13, flame: 'V-2', stock: true, uses: 'Clips, cable ties, gears', note: 'Values dry as moulded. Absorbs moisture and gains toughness over the first weeks.' },
  { id: 'pa66-gf30', name: 'PA66 GF30', grade: 'DuPont Zytel 70G30HSL', family: 'Engineering', process: 'Moulding', tensile: 185, hdt: 250, shrink: '0.3–1.0', density: 1.37, flame: 'HB', stock: true, uses: 'Structural housings, brackets, under-bonnet parts', note: 'Shrinks differently along and across the flow: gate position decides flatness. Needs hardened steel.' },
  { id: 'pom', name: 'POM copolymer', grade: 'Celanese Hostaform C 9021', family: 'Engineering', process: 'Moulding', tensile: 64, hdt: 104, shrink: '1.8–2.2', density: 1.41, flame: 'HB', stock: true, uses: 'Gears, bushings, snap fits', note: 'Low friction and good fatigue life. Cannot be glued or painted reliably.' },
  { id: 'pbt-gf30', name: 'PBT GF30', grade: 'BASF Ultradur B 4300 G6', family: 'Engineering', process: 'Moulding', tensile: 135, hdt: 205, shrink: '0.3–0.9', density: 1.53, flame: 'HB', stock: true, uses: 'Connectors, coil formers, sensor bodies', note: 'Dimensionally stable in humidity, unlike nylon.' },
  { id: 'tpu', name: 'TPU 85A', grade: 'BASF Elastollan 1185 A', family: 'Elastomer', process: 'Moulding', tensile: 45, hdt: null, shrink: '0.8–1.5', density: 1.12, flame: 'HB', stock: true, uses: 'Overmoulded grips, seals, protective cases', note: 'Tensile value is at break. Bonds well to PC and ABS in two-shot moulding.' },
  { id: 'tpe', name: 'TPE 60A', grade: 'Kraiburg Thermolast K', family: 'Elastomer', process: 'Moulding', tensile: 7, hdt: null, shrink: '1.5–2.0', density: 0.9, flame: 'HB', stock: true, uses: 'Soft-touch overmoulds, gaskets, feet', note: 'Tensile value is at break. Grade is chosen to match the substrate it bonds to.' },
  { id: 'peek', name: 'PEEK', grade: 'Victrex 450G', family: 'High performance', process: 'Moulding', tensile: 98, hdt: 152, shrink: '1.0–1.3', density: 1.3, flame: 'V-0', stock: false, uses: 'Medical instruments, pump parts, aerospace clips', note: 'Mould temperature 180 °C. Ordered per job, allow 15 days.' },
  { id: 'pps-gf40', name: 'PPS GF40', grade: 'Solvay Ryton R-4', family: 'High performance', process: 'Moulding', tensile: 195, hdt: 260, shrink: '0.2–0.5', density: 1.65, flame: 'V-0', stock: false, uses: 'Pump housings, EV busbar carriers', note: 'Flashes easily: tools need vents below 0.01 mm. Ordered per job, allow 10 days.' },
  { id: 'pei', name: 'PEI', grade: 'Sabic Ultem 1000', family: 'High performance', process: 'Moulding', tensile: 105, hdt: 201, shrink: '0.5–0.7', density: 1.27, flame: 'V-0', stock: false, uses: 'Sterilisable medical parts, aircraft interior', note: 'Naturally amber and transparent. Ordered per job, allow 15 days.' },
  { id: 'sls-pa12', name: 'PA12 (SLS)', grade: 'EOS PA 2200', family: '3D printing', process: 'Printing', tensile: 48, hdt: 86, shrink: null, density: 0.93, flame: 'HB', stock: true, uses: 'Functional prototypes, jigs, low-volume housings', note: 'Slightly grainy white surface. Can be dyed black or vapour-smoothed.' },
  { id: 'mjf-pa12', name: 'PA12 (MJF)', grade: 'HP 3D High Reusability PA 12', family: '3D printing', process: 'Printing', tensile: 48, hdt: 95, shrink: null, density: 1.01, flame: 'HB', stock: true, uses: 'End-use parts, clips, ducting', note: 'Grey as printed, usually dyed black. More uniform strength across build directions than SLS.' },
  { id: 'sla-resin', name: 'ABS-like resin (SLA)', grade: 'Somos EvoLVe 128', family: '3D printing', process: 'Printing', tensile: 47, hdt: 49, shrink: null, density: 1.12, flame: 'HB', stock: true, uses: 'Appearance models, fit checks, casting masters', note: 'Smoothest surface of the three. Softens above 50 °C and yellows in sunlight.' },
];

export const MATERIAL_FAMILIES = ['All', 'Commodity', 'Engineering', 'High performance', 'Elastomer', '3D printing'];

export const CERTIFICATIONS = [
  { standard: 'ISO 9001:2015', scope: 'Design and manufacture of injection moulds and moulded plastic parts', since: 2011, valid: 'March 2028' },
  { standard: 'IATF 16949:2016', scope: 'Manufacture of moulded plastic parts for automotive interiors', since: 2016, valid: 'August 2027' },
  { standard: 'ISO 13485:2016', scope: 'Contract moulding of non-sterile medical device components', since: 2019, valid: 'November 2027' },
  { standard: 'ISO 14001:2015', scope: 'Environmental management, Chang\'an site', since: 2018, valid: 'March 2028' },
];

export const INSPECTION_GATES = [
  {
    code: 'IQC',
    name: 'Incoming',
    checks: ['Resin lot matched to its certificate of analysis', 'Melt flow index verified on one bag per lot', 'Tool steel hardness and certificate checked before cutting'],
  },
  {
    code: 'FAI',
    name: 'First article',
    checks: ['Every drawing dimension measured on five shots per cavity', 'Report issued with balloon drawing before production is released', 'Colour compared to the signed master under D65 light'],
  },
  {
    code: 'IPQC',
    name: 'In process',
    checks: ['Critical dimensions every two hours, charted for Cpk', 'Part weight logged every hour as an early drift signal', 'Cosmetic check against boundary samples at the press'],
  },
  {
    code: 'OQC',
    name: 'Outgoing',
    checks: ['AQL 0.65 major and 1.5 minor to ISO 2859-1 unless you specify otherwise', 'Carton drop test on the first shipment of each part', 'Labels and quantities checked against your purchase order'],
  },
];

export const DOCUMENTS = [
  'First article inspection report with ballooned drawing',
  'CMM and vision measurement data in CSV',
  'Resin certificate of analysis and RoHS / REACH declarations',
  'PPAP level 3 package for automotive programmes',
  'Process capability study (Cpk) on agreed dimensions',
  'Mould trial record with processing parameters',
];

export const QUALITY_FIGURES = [
  { label: 'On-time delivery', value: '96.4%', note: '2,318 of 2,405 shipments left on or before the confirmed date' },
  { label: 'Customer returns', value: '312 PPM', note: 'Against a 2025 target of 400' },
  { label: 'T1 approved without rework', value: '71%', note: '93 of 131 new tools. The rest needed a T2' },
  { label: 'Claims answered in one working day', value: '100%', note: '27 claims, all with an 8D report' },
];

export const TEAM = [
  { name: 'Lin Zhaohui', role: 'Engineering director', note: 'Signs off every DFM report' },
  { name: 'Vivian Luo', role: 'Overseas sales manager', note: 'English and German' },
  { name: 'Deng Weiming', role: 'Quality manager', note: 'IATF lead auditor' },
];

// Regions of the mould cross-section on the Capabilities page, in callout order.
export const MOULD_PARTS = [
  { id: 'sprue', name: 'Sprue and gate', text: 'Molten resin enters here. Where the gate sits decides how the part fills, where weld lines fall and how it warps.' },
  { id: 'fixed', name: 'Cavity plate', text: 'The fixed half. It forms the outside of the part, so its steel takes the surface finish you specify.' },
  { id: 'cavity', name: 'The part', text: 'The gap between the two halves. Its thickness is your wall thickness, plus the resin’s shrinkage.' },
  { id: 'moving', name: 'Core plate', text: 'The moving half. It forms the inside of the part and carries it away when the mould opens.' },
  { id: 'cooling', name: 'Cooling channels', text: 'Water circuits drilled through both halves. Cooling is most of the cycle time, and uneven cooling is most of the warp.' },
  { id: 'ejector', name: 'Ejector pins', text: 'Push the part off the core. They leave small witness marks, so we agree their positions with you at DFM.' },
  { id: 'guide', name: 'Guide pillars', text: 'Align the halves to within a few microns every cycle, for the life of the tool.' },
];
