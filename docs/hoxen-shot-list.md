# Hoxen: image shot list

14 images for the Hoxen concept site. Eight are essential; the site works without the other six but is better with them.

Hoxen sells chargers, cables and phone cases. The site keeps one product in the middle of the screen while the page moves around it, so every shot needs the product sharp, alone and on the same plain background.

## How to use this

1. Generate shot 1 first and get it right. Use it as the reference image for every later shot so the charger's shape, colour and finish stay the same.
2. Paste the **style block** below at the start of every prompt, then add the shot's own prompt.
3. Generate at the highest resolution Flow offers. The long edge should be at least 2,400 pixels.
4. Shapes are the ones Flow produces natively: 16:9, 4:3, 3:4 and 1:1. Do not crop anything.
5. Save each file with the exact name given, as JPG or PNG, into `photo-originals/hoxen/` (not committed), then run `node scripts/process-photos.mjs hoxen` followed by `node scripts/cutout-photos.mjs hoxen`. The first compresses them into `src/concepts/hoxen/photos/`; the second cuts the products out of their backgrounds.
6. Pick the result with the plainest background and the cleanest product edges. I cut the products out of the background in code, so an even backdrop matters more than a pretty one.

## Style block (start every prompt with this)

> Studio product photograph for a consumer electronics brand. Seamless pale fog-grey background and floor, one flat even tone with no horizon line, no gradient and no vignette. Soft even light from a large overhead softbox, with one gentle shadow directly beneath the product. Products are matte graphite-grey polycarbonate with crisp edges, slightly rounded corners and a fine soft-touch texture. The inside of every USB-C port is safety orange. Shot on a 90 mm macro lens at f/8, the whole product sharp. No text, no logos, no icons, no regulatory markings, no labels, no stickers, no glow, no light trails, no reflections of the studio, no props except those named.

## The products

Describe them the same way each time.

| Product | Looks like |
|---|---|
| 65 W charger | A compact graphite block about the size of a golf ball (roughly 50 × 50 × 30 mm). Two USB-C ports side by side on one small face. Two flat folding US prongs on the opposite face |
| The other chargers | Same design in three more sizes: 30 W (smallest, one port), 100 W (three ports) and 140 W (largest, four ports) |
| Cable | Braided graphite-grey USB-C to USB-C cable with slim graphite connectors and a thin safety-orange ring where each connector meets the cable |
| Phone case | A slim matte case for a large smartphone, with one rectangular camera cut-out in the top-left corner. Photographed in **off-white**, not graphite, because the site re-colours it |

## Colours

| Name | Hex | Looks like |
|---|---|---|
| Fog (background) | `#E6E8EA` | Very pale cool grey |
| Graphite (products) | `#2B2D31` | Near-black neutral grey, not blue and not brown |
| Safety orange (ports, cable rings) | `#FF5A1F` | Bright, slightly red orange |

## Essential shots

### 1. Home page hero: the 65 W charger
- **File:** `hero-charger.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** The 65 W charger standing upright in the exact centre of the frame, turned three-quarters so the face with the two orange-lined USB-C ports and one side are visible. Prongs folded away. The charger fills about one third of the frame's height. Everything around it is empty fog-grey background.
- **Why so much empty space:** large type sits behind and around the product.

### 2. Home page hero, phone crop
- **File:** `hero-charger-tall.jpg`
- **Shape:** portrait, 3:4
- **Prompt:** The same charger and angle as the reference image, framed vertically, centred, filling about one quarter of the frame's height.

### 3. The charger taken apart
- **File:** `exploded.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** Exploded view of the 65 W charger, seen exactly side-on with no perspective. Five parts float in one horizontal row with clear, equal gaps between them and do not touch or overlap. From left to right: the front shell with the two USB-C ports; a green-black circuit board carrying small black chips; a copper-wound transformer with two cylindrical capacitors; a thin aluminium heat-spreader plate; the rear shell with the two prongs unfolded. All parts are centred on the same horizontal line. Plain fog-grey background, soft shadow under each part.
- **This is the hardest shot.** I slide these five parts together and apart as the page scrolls, so they must be separate, in a row and side-on. If Flow cannot do it after a few tries, send the closest result and tell me; I will draw the inside in code instead.

### 4. The four chargers
- **File:** `lineup.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** Four chargers of the same design standing in a row, seen straight on from the front, smallest on the left to largest on the right, with equal gaps and not touching. The first has one USB-C port, the second two, the third three and the fourth four. All ports face the camera and are lined in safety orange.

### 5. Phone case, back
- **File:** `case-back.jpg`
- **Shape:** portrait, 3:4
- **Prompt:** An empty off-white matte phone case seen straight on from the back, standing upright in the centre of the frame. One rectangular camera cut-out in the top-left corner. No phone inside. The orange-port rule in the style block does not apply to this shot.

### 6. Phone case, on a phone
- **File:** `case-angle.jpg`
- **Shape:** portrait, 3:4
- **Prompt:** A large smartphone in the off-white matte case, standing upright and turned three-quarters to show the back, one edge with two side buttons, and the raised lip around the camera cut-out. The phone's screen is not visible. The phone itself is plain black with no branding and a plain black camera block.

### 7. Cable
- **File:** `cable-coil.jpg`
- **Shape:** square, 1:1
- **Prompt:** Seen from directly above: the braided graphite cable in a loose coil of three loops, with both connectors lying outside the coil and their orange rings visible. Centred, with empty background all round.

### 8. On a desk
- **File:** `desk.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** The 65 W charger plugged into a plain white power strip on a pale oak desk, with two braided graphite cables running from it: one to a closed silver laptop, one to a face-down black smartphone. Seen from above at an angle. Soft daylight from the left. Replace the studio background in the style block with: pale oak desk surface, nothing else on it.

## Good to have

| # | File | Shape | Prompt |
|---|---|---|---|
| 9 | `port-macro.jpg` | square 1:1 | Extreme close-up of the two USB-C ports on the 65 W charger, filling the frame. The safety-orange inside of each port is sharp; the soft-touch texture of the shell is visible. |
| 10 | `pcb-macro.jpg` | landscape 4:3 | Extreme close-up of the charger's circuit board lying flat: one square black chip in the centre, surrounded by tiny surface-mount components and copper traces. No printing or numbers on any component. |
| 11 | `cable-connector.jpg` | square 1:1 | Extreme close-up of one USB-C connector of the braided cable lying on the fog-grey surface, showing the weave of the braid and the thin orange ring. |
| 12 | `wall.jpg` | portrait 3:4 | The 65 W charger plugged into a plain white US wall socket on a white wall, one braided cable hanging straight down from it and out of the bottom of the frame. Seen straight on. Replace the studio background with: plain white wall. |
| 13 | `travel.jpg` | landscape 4:3 | One hand holding the 65 W charger between thumb and two fingers above the open front pocket of a plain grey fabric backpack, to show how small it is. Hand and pocket only, no face. Replace the studio background with: the backpack, softly out of focus. |
| 14 | `box.jpg` | landscape 4:3 | A small plain box in unprinted grey recycled card, lid lifted and set beside it, with the 65 W charger sitting inside in a moulded card tray. Seen from above at an angle. |

## Checks before saving a result

- The background is one flat tone. Reject anything with a gradient, a visible floor line, a spotlight pool or a coloured cast.
- No text, logos, icons or regulatory marks anywhere, including on prongs, chips, the power strip and the laptop.
- Graphite is neutral near-black. If it drifts blue or brown, regenerate.
- USB-C ports are orange inside in every charger shot. This is the brand's signature detail.
- Shot 3: five separate parts, in a row, side-on, not touching.
- Shot 4: four chargers, clearly different sizes, with one, two, three and four ports.
- Shots 5 and 6: the case is off-white, with nothing else coloured in the frame.
- Hands, where they appear, are natural: five fingers, no jewellery. No faces.
