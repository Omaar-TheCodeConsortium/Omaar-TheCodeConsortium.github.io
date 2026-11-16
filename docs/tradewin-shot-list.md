# Tradewin: image shot list

18 images for the Tradewin concept: 12 studio product shots and 6 photographs of a product in use. All were generated on 16 November 2026 through the Higgsfield MCP server. This file is the record of the prompts, so any shot can be redone.

Tradewin sells other workshops' goods, so the products are **not** colour-matched to the brand. Each one is in whatever bright colours suit it. An earlier set, shot four to a sheet in the brand's green and coral, was dropped because it made the shop look like a boutique label instead of a store. Those sheets are kept in `photo-originals/tradewin/sheets/` and are not used.

## Settings

- Model `seedream_5_0_flash`, `resolution: "2k"`, 0.5 credit an image.
- Studio shots: `aspect_ratio: "1:1"` (2048 × 2048).
- In-use shots: `aspect_ratio: "4:3"` (2368 × 1776), with the product's studio shot passed as a reference (`medias: [{ value: <job id of the studio shot>, role: "image_references" }]`) so the product keeps its shape and colours.
- The free plan runs one job at a time. Submit one, wait for it, then the next.

## Processing

Save each result in `photo-originals/tradewin/` under the file name below, then run:

```bash
node scripts/process-photos.mjs tradewin
```

- **Studio shots** become 1200 px squares. The script works out where the paper is, divides the picture by it so the paper is white everywhere, and fades the rim to pure white. The site multiplies these into coloured tiles, so no rectangle shows round the product.
- **In-use shots** (file names ending `-use`) are only resized, to 1600 × 1200.

## Studio shots

Every prompt is the product line below followed by this style block:

> The product is centred and fills about 70% of the frame, seen from a three-quarter angle slightly above, on a seamless pure white background with a soft natural contact shadow. Bright even softbox lighting, crisp focus across the whole product, true-to-life saturated colours. No text, no logos, no labels, no packaging, no hands, no other props.

Each product line starts "Studio e-commerce product photograph of".

| File | Product line |
|---|---|
| `stretch-lids.png` | a set of 5 round silicone stretch lids in graduated sizes, each a different bright colour: sky blue, sunflower yellow, coral pink, mint green and orange, fanned out and overlapping, slightly translucent silicone with small pull tabs |
| `bag-clips.png` | a set of 10 plastic food bag sealing clips in assorted bright colours (red, yellow, blue, green, orange and pink) in three different lengths, laid out in a neat loose fan |
| `measuring-spoons.png` | a set of 4 polished stainless steel measuring spoons in graduated sizes with long flat handles, joined at the end by a steel ring and fanned out |
| `cable-clips.png` | 6 small self-adhesive silicone cable holder clips in assorted bright colours (yellow, teal, coral red, navy blue, orange and grey) lined up in a row, with one black USB charging cable threaded through the first three |
| `tech-pouch.png` | a zippered travel cable organiser pouch in mustard yellow water-resistant nylon with a dark grey zip, lying open to show elastic loops holding a white charging cable, a small black charger and a pair of earbuds |
| `phone-stand.png` | a folding adjustable desktop phone stand made of anodised sky blue aluminium with black silicone pads and a visible hinge, empty, with no phone on it |
| `travel-bottles.png` | a set of 4 squeezable silicone travel bottles with white flip caps, each a different bright colour: pink, turquoise, lime green and orange, standing upright in a row (seen from a slightly raised front angle) |
| `packing-cubes.png` | a set of 4 zippered suitcase packing cubes in cobalt blue ripstop fabric with black mesh top panels and bright orange zip pulls, in four sizes, stacked and leaning from large to small |
| `luggage-tags.png` | a pair of soft silicone luggage tags, one bright red and one bright yellow, each with a blank white address card behind a clear window and a braided steel loop cable, laid side by side |
| `night-light.png` | a small rechargeable bedside night light: a smooth rounded dome of frosted silicone glowing warm amber from inside, sitting on a short round base of pale beech wood (with a faint warm glow on the surface round it) |
| `door-hooks.png` | an over-the-door hook rack: a matte black steel bar with two flat brackets that hang over the top of a door and five hooks, each tipped with a natural beech wood ball (seen straight on; no door, no clothes) |
| `fabric-shaver.png` | a handheld rechargeable electric fabric shaver for removing lint and bobbles from clothes, in glossy white with a bright orange handle band, a round steel mesh shaving head and a transparent lint container, standing upright |

**What came back differently.** The model does not always count. The measuring spoons came out as three, the packing cubes as three and the bag clips as roughly nine. The catalogue (`src/concepts/tradewin/catalog.js`) describes what the photographs show, not what the prompts asked for. If a shot is redone, check the pack size, the alt text and the specs against the new picture.

## In-use shots

Each prompt starts "Lifestyle photograph for an online shop." and ends "True-to-life colours. No people, no hands, no text, no logos." The reference image is the product's own studio shot.

| File | Scene |
|---|---|
| `stretch-lids-use.png` | The same five coloured silicone stretch lids, in use in a bright home kitchen: each lid stretched tight over a different container on a pale wooden worktop, a glass bowl of salad, a white ceramic bowl of berries, a steel mixing bowl, a small jar and half a watermelon. Soft morning daylight from a window on the left, shallow depth of field, a tiled wall softly out of focus behind. |
| `cable-clips-use.png` | The same six small coloured silicone cable clips, stuck in a neat row along the front edge of a tidy pale oak desk, each one holding the end of a different charging cable so the cables do not fall to the floor. An open laptop, a phone, a small plant and a mug softly out of focus behind. Bright natural daylight, close three-quarter view of the desk edge. |
| `bag-clips-use.png` | The same brightly coloured bag sealing clips, on a kitchen pantry shelf: each clip clamped across the folded top of a different open food bag (coffee beans, pasta, crisps, flour, rice) standing in a row on a pale wooden shelf. Bright natural daylight, glass storage jars softly out of focus behind, plain unbranded bags. |
| `night-light-use.png` | The same dome night light on its beech base, switched on and glowing warm amber on a wooden bedside table in a dark bedroom at night, beside a paperback and a glass of water, with the edge of a bed and linen pillow softly out of focus. The lamp is the only light in the room. |
| `packing-cubes-use.png` | The same three cobalt blue packing cubes with mesh tops and orange zip pulls, zipped full of neatly folded clothes and fitted side by side inside an open hard-shell suitcase lying on a made bed, seen from above at a slight angle. Bright natural daylight. |
| `travel-bottles-use.png` | The same four coloured squeezable travel bottles with white flip caps, standing inside a clear zipped wash bag on a white bathroom shelf beside a folded towel and a toothbrush, a mirror softly out of focus behind. Bright clean daylight. |

## Where each one is used

- **Product grid, podium and basket:** the studio shot, multiplied into a tile.
- **Wholesale product page:** the studio shot repeated once for every unit in a carton.
- **Product page gallery and grid hover:** the in-use shot, where a product has one.
- **Direct home page, "Where they end up":** all six in-use shots.
