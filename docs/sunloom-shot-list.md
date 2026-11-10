# Sunloom International: image shot list

17 images for the Sunloom concept site. Nine are essential; the site works without the other eight but is better with them.

## How to use this

1. Generate one image first (shot 1) and get it right. Use it as the reference image for every later shot so the room, light and linen stay consistent.
2. Paste the **style block** below at the start of every prompt, then add the shot's own prompt.
3. Generate at the highest resolution Flow offers. The long edge should be at least 2,400 pixels.
4. Save each file with the exact name given, as JPG or PNG, into `photo-originals/sunloom/` (not committed), then run `node scripts/process-photos.mjs sunloom`. That crops and compresses them into `src/concepts/sunloom/photos/`. The site picks a photo up by its file name; until a file exists, that slot shows fabric drawn in code.
5. Pick the least "perfect" result each time. Slightly uneven creases, an off-centre pillow and soft shadows read as real photography. Smooth, glossy, symmetrical results read as generated.

## Style block (start every prompt with this)

> Editorial interiors photograph for a linen bedding brand. Natural window light from the left, late morning, slightly overcast, soft shadows. Stonewashed European flax linen with visible slubs, a matte surface and natural creases. Colour is muted and slightly desaturated, with fine film grain. Shot on a 50 mm lens at f/4. The room has a pale lime-plastered wall and a light oak floor. No faces, no text, no logos, no labels, no patterns on the fabric, no props except those named. Not glossy, not perfectly smooth, not symmetrically staged.

## Colours

Use these names in prompts. The hex values are for checking results by eye.

| Dye | Hex | Looks like |
|---|---|---|
| Indigo | `#23408F` | Deep natural-dye blue, not navy and not purple |
| Oat | `#D9CDB8` | Undyed flax, warm beige |
| Chalk | `#F1EDE4` | Off-white |
| Madder | `#A4442E` | Rust red |
| Sage | `#8C977A` | Grey-green |
| Ochre | `#C4923A` | Mustard gold |
| Lake | `#6F8798` | Blue-grey |
| Soot | `#37322E` | Warm near-black |

## Essential shots

### 1. Home page hero
- **File:** `hero-bed.jpg`
- **Shape:** landscape, 16:9
- **Prompt:** A low wooden bed made up in indigo washed linen, seen from the foot corner at a three-quarter angle. Duvet pulled back loosely on one side, two pillows, one slightly askew. The bed sits in the right two-thirds of the frame. The left third is empty pale wall, with nothing on it. Camera at mattress height.
- **Why the empty wall:** the headline sits over the left third.

### 2. Home page hero, phone crop
- **File:** `hero-bed-tall.jpg`
- **Shape:** portrait, 4:5
- **Prompt:** The same bed and room as the reference image, framed vertically. The bed fills the lower two-thirds. The top third is empty pale wall.

### 3. Stack of folded linen
- **File:** `stack.jpg`
- **Shape:** portrait, 4:5
- **Prompt:** Seven folded linen sheets stacked on a light oak stool against the pale wall, seen straight on. From bottom to top the colours are soot, indigo, lake, sage, ochre, madder and oat. Edges are not perfectly aligned. Soft shadow on the wall to the right.

### 4. Linen close-up
- **File:** `weave.jpg`
- **Shape:** square, 1:1
- **Prompt:** Extreme close-up of oat-coloured washed linen lying in soft folds, filling the whole frame. Raking light from the left shows the weave and the slubs in the yarn. Shallow depth of field, with the centre sharp.

### 5 to 9. Product shots (to be re-coloured on the site)

These five are shot in **chalk** linen on a plain pale-grey backdrop, with soft even light and no coloured objects. The site tints them to whichever dye the shopper picks, so the fabric must be off-white and the scene must have no other colour in it. For these, replace the room description in the style block with: "Plain pale-grey paper backdrop and floor, soft even light, gentle shadow."

| # | File | Shape | Prompt |
|---|---|---|---|
| 5 | `product-duvet.jpg` | portrait 4:5 | A duvet in a chalk linen cover, folded once and laid over a simple bench, with two matching pillows leaning against it. |
| 6 | `product-sheets.jpg` | portrait 4:5 | A fitted sheet and a flat sheet in chalk linen, folded and stacked, with the top one half unfolded and spilling forward. |
| 7 | `product-pillowcases.jpg` | portrait 4:5 | Two pillows in chalk linen pillowcases, one lying flat and one leaning on it, seen from slightly above. |
| 8 | `product-throw.jpg` | portrait 4:5 | A heavy chalk linen throw draped over the arm of a plain wooden chair, falling to the floor in deep folds. |
| 9 | `product-table.jpg` | portrait 4:5 | A chalk linen tablecloth hanging over the corner of a table, with four folded napkins stacked on top. Nothing else on the table. |

## Good to have

| # | File | Shape | Prompt |
|---|---|---|---|
| 10 | `product-towel.jpg` | portrait 4:5 | Same grey backdrop as shots 5 to 9. A chalk waffle-weave linen bath towel hanging from a single wooden peg, with a second one folded on a stool below. |
| 11 | `detail-buttons.jpg` | square 1:1 | Close-up of the foot of a duvet cover in oat linen showing a row of four coconut-shell buttons, one undone. |
| 12 | `bed-madder.jpg` | landscape 3:2 | The same bed and room as the reference, made up in madder (rust red) linen with oat pillowcases, seen from the side. |
| 13 | `bed-sage.jpg` | landscape 3:2 | The same bed and room as the reference, made up in sage linen, duvet thrown back, seen from above at an angle. |
| 14 | `mill-loom.jpg` | landscape 16:9 | Documentary photograph inside a weaving mill. Close view of an industrial rapier loom weaving undyed linen, hundreds of warp threads running into the frame. Fluorescent factory light mixed with daylight. No people. Ignore the room description in the style block. |
| 15 | `mill-wash.jpg` | portrait 4:5 | Documentary photograph. Lengths of wet oat linen hanging to dry from overhead rails in a tall, bright factory hall. One worker seen from behind at a distance, out of focus. Ignore the room description in the style block. |
| 16 | `flax-field.jpg` | landscape 16:9 | A flax field in northern France in early summer, pale blue flowers, low horizon, overcast sky. No buildings, no people. Ignore the room description in the style block. |
| 17 | `wholesale-bolts.jpg` | landscape 16:9 | Rolls of linen fabric stacked on steel warehouse shelving, in indigo, madder, sage, ochre, oat and soot. Seen straight on, filling the frame. Ignore the room description in the style block. |

## Checks before saving a result

- The fabric looks like linen: matte, creased, slightly uneven. Reject anything that looks like satin or cotton percale.
- No text, logos, labels or watermarks anywhere, including on the buttons and the loom.
- Indigo is blue. If it drifts towards purple, regenerate.
- Hands and people, where they appear, are distant or cropped. No faces.
- Shots 5 to 10 contain no colour other than off-white and grey.
