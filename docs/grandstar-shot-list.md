# Grandstar Precision: image shot list

14 images for the redesigned Grandstar concept. Nine are essential; the site works without the other five but is better with them.

The site pins measurements onto these photographs with thin leader lines, so each shot needs one clear subject, sharp focus on it, and a calm area for text.

## How to use this

1. Generate shot 1 first and get it right. Use it as the reference image for every later shot so the steel, the light and the building stay consistent.
2. Paste the **style block** below at the start of every prompt, then add the shot's own prompt.
3. Generate at the highest resolution Flow offers. The long edge should be at least 2,400 pixels.
4. Save each file with the exact name given, as JPG or PNG, into `photo-originals/grandstar/` (not committed), then run `node scripts/process-photos.mjs grandstar`. That compresses them into `src/concepts/grandstar/photos/`. If a result is not in the shape listed, leave it as it is and tell me; I will crop it.
5. Pick the least "perfect" result each time. Fine machining marks, a little oil, a scuffed floor and uneven reflections read as a real plant. Mirror-clean, symmetrical, glowing results read as generated.

## Style block (start every prompt with this)

> Industrial documentary photograph inside a modern injection-moulding plant in southern China. Cool, even overhead LED light with soft daylight from high windows. Colour is restrained and slightly desaturated: steel greys, deep blue-black shadows, a pale grey epoxy floor. Machines are painted off-white with dark navy panels. Tool steel shows fine machining marks and real reflections. Shot on a 50 mm lens at f/5.6, sharp on the subject, fine grain. No faces, no readable text, no logos, no brand names, no screens with writing, no red or orange objects, no sparks flying towards the camera, no lens flare, no blue or teal glow.

## The two parts

Two plastic parts appear across the shots. Describe them the same way each time.

| Part | Looks like |
|---|---|
| Controller housing | A light-grey matte plastic box with an open top, about the size of a paperback (120 × 80 × 30 mm), thin walls, rounded corners, four screw posts inside |
| Controller lid | A flat black matte plastic lid, long and narrow (186 × 94 × 22 mm), with a raised rim and two low ribs across the inside. The black has a faint fibrous texture |

## Essential shots

### 1. Home page hero: the open mould
- **File:** `hero-mould.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** Close three-quarter view of one half of a steel injection mould tool, open, mounted in the press. The polished cavity for a small rectangular housing sits in the right half of the frame and catches the light. Guide pillars, cooling-line fittings and ejector pin marks are visible. The left third of the frame falls away into dark, out-of-focus machine interior with nothing in it.
- **Why the dark left third:** the headline sits there in white.

### 2. Home page hero, phone crop
- **File:** `hero-mould-tall.jpg`
- **Shape:** portrait, 4:5
- **Prompt:** The same mould half as the reference image, framed vertically. The polished cavity fills the lower half. The upper half is dark, out-of-focus machine interior.

### 3. Tool room
- **File:** `toolroom.jpg`
- **Shape:** landscape, 3:2
- **Prompt:** Inside the enclosure of a CNC milling machine. A carbide end mill is cutting a pocket into a block of tool steel clamped in a vice, with a stream of milky coolant running over it. Fresh bright tool paths on the steel. The block sits left of centre; the right third is the plain grey wall of the enclosure.

### 4. Press hall
- **File:** `press-hall.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** A long row of injection-moulding machines seen down the aisle from standing height, running away to a vanishing point on the right. Clean pale grey floor with painted walkway lines, hoppers above each machine, robot arms above the nearest two. One operator far down the aisle, seen from behind and out of focus.

### 5. Part leaving the tool
- **File:** `ejection.jpg`
- **Shape:** portrait, 4:5
- **Prompt:** Close view between the two halves of an open mould. A robot gripper with small suction cups holds a freshly moulded light-grey controller housing just clear of the cavity. The steel behind it is sharp; the gripper arm leaves the top of the frame.

### 6. Measurement
- **File:** `cmm.jpg`
- **Shape:** landscape, 3:2
- **Prompt:** A coordinate measuring machine in a clean, bright inspection room. Its ruby-tipped probe is touching the rim of a black controller lid held in a simple aluminium fixture on a dark granite table. Seen from table height, the probe and lid in the left half of the frame, the granite surface running out empty to the right.

### 7. Resin and colour plaques
- **File:** `materials.jpg`
- **Shape:** landscape, 3:2
- **Prompt:** Seen from directly above on a brushed steel bench: five shallow steel trays of plastic pellets (clear, natural white, black, light grey, translucent amber) in a row, with a fan of small rectangular moulded sample plaques in the same colours laid beside them. Even light, soft shadows.

### 8. Case study: the lid
- **File:** `case-lid.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** A single black controller lid lying inside-up on a dark granite surface plate, seen from a low angle along its length. A steel straight edge rests across its rim, showing the thinnest sliver of light underneath at the middle. The lid sits in the lower right; the upper left is plain dark background.

### 9. Dock
- **File:** `dock.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** Plain brown export cartons stacked squarely on wooden pallets and wrapped in clear film, lined up inside a loading bay. A roller door stands open on the right, with flat daylight and the back of a shipping container beyond. No labels or printing on the cartons.

## Good to have

| # | File | Shape | Prompt |
|---|---|---|---|
| 10 | `edm.jpg` | square 1:1 | Close view into the tank of a spark-erosion machine. A copper electrode shaped like a small rib pattern is lowered into a steel mould insert under clear dielectric oil. Tiny bubbles rise from the gap. |
| 11 | `printer.jpg` | portrait 4:5 | An industrial resin 3D printer with its door open. A build platform is rising out of the vat carrying six translucent white prototype housings on fine support structures, resin still dripping from them. |
| 12 | `lab-bench.jpg` | landscape 3:2 | An inspection bench seen from above at an angle: a digital height gauge, a set of pin gauges in a wooden case, a micrometer and three light-grey controller housings laid in a row on a green cutting mat. Displays are blank. |
| 13 | `polish.jpg` | square 1:1 | Two gloved hands polishing a mould cavity by hand with a small wooden stick and diamond paste, under a bench magnifier lamp. The polished steel reflects the lamp as a soft ring. Hands and steel only. |
| 14 | `mould-store.jpg` | landscape 16:9 | Heavy steel racking holding dozens of closed mould tools, each a dark steel block with lifting eyes, seen straight on and filling the frame. Bare metal tags hang from some, with no writing on them. |

## Checks before saving a result

- No text anywhere: machine panels, tags, cartons, gauges and screens must be blank. This is the most common fault, so look closely.
- The mould looks machined, not cast or chrome-plated: flat ground faces, crisp edges, visible pins and fittings.
- No red, orange or glowing blue. The site's red is reserved for the measurements drawn over the photos.
- People, where they appear, are distant, from behind, or hands only. No faces.
- The housing is light grey and the lid is black in every shot they appear in.
- Shots 1, 2, 6 and 8 keep their empty area. Text sits there.
