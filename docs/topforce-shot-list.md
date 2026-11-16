# Topforce Sports: image shot list

12 images for the Topforce Sports concept site: eight product shots and four scenes. The product shots are essential. The site holds together without the scenes, but the home page is much weaker without them.

Topforce sells barbells, plates, dumbbells, kettlebells, a rack and a bench. The site is black. Every product is photographed on black and the site drops that black, so the product appears to stand on the page itself.

**The hero needs no photograph.** The first screen is one end of a loaded barbell, drawn in code at the size of the screen, and you load it by tapping plates. Nothing here replaces it. The photographs are for everything below it and for the shop.

Until a photograph is supplied, the site shows a striped block in its place, labelled with the shot number and file name below.

## Where each photograph is used

| Shot | Used on | How it is shown |
|---|---|---|
| 1 to 8, the products | Shop list, each product's own page, the cart | Whole product, never cropped. Where the frame is a different shape from the picture, the page's black fills the rest, so the picture's background must be truly black |
| 1, 2, 4, 5, 6 | Home page, the five lanes under "Eight products" | A tall slice through the **middle** of the picture, about a third of its width, widening when pointed at. The middle of the frame has to be recognisable on its own |
| 9, drop | Home page, full screen | Headline and three figures set over the lower left |
| 10, knurl | Home page, tall panel on the left | Cropped a little at the sides on wide screens |
| 11, foundry | Home page, full width | Shown whole |
| 12, garage | Foot of the shop page, full screen | Headline and a button set over the lower left |

The plates drawn in the hero have their weight moulded into the rim. The photographed plates must not: generated lettering comes out as nonsense, so every photographed product is plain and carries only its yellow-green detail.

## How to use this

1. Generate shot 2 (the bumper plates) first and get it right. Use it as the reference image for every later product shot, so the black, the light and the yellow-green stay the same.
2. Paste the **style block** below at the start of every product prompt (shots 1 to 8), then add the shot's own prompt. The four scenes (shots 9 to 12) have their own short style line.
3. Generate at the highest resolution Flow offers. The long edge should be at least 2,400 pixels.
4. Shapes are the ones Flow produces natively: 16:9, 4:3 and 3:4. Do not crop anything.
5. Save each file with the exact name given, as JPG or PNG, into `photo-originals/topforce/` (not committed), then run `node scripts/process-photos.mjs topforce`. It compresses them into `src/concepts/topforce/photos/`, and the site picks them up by name.
6. Pick the result with the blackest, plainest background. A grey haze, a visible floor line or a pool of light on the floor will show on the page as a pale rectangle round the product.

## Style block (start every product prompt with this)

> Low-key studio product photograph for a strength-equipment brand. Pure black seamless background and matte black floor: one flat black with no horizon line, no gradient, no haze, no spotlight pool and no reflection on the floor. One hard strip light from the upper left and a thin rim light from behind on the right, so every edge of the product is picked out against the black. The product is matte black unless a material is named. It carries exactly one accent in vivid yellow-green, described below, and nothing else in the frame is coloured. Shot on an 85 mm lens at f/8, the whole product sharp, centred, with empty black all round it. No text, no logos, no numbers, no lettering moulded into rubber or stamped into steel, no stickers, no people, no props except those named.

## The products

Describe them the same way each time. The yellow-green accent is the brand's one signature detail and appears once on every product.

| Product | Looks like | The yellow-green accent |
|---|---|---|
| Olympic bar | A straight steel barbell: a black shaft with fine diamond knurling, and a thicker bright chrome sleeve at each end | A thin ring round the bar where the sleeve meets the shaft |
| Bumper plate | A thick black rubber disc, 45 cm across, with a plain face, one shallow raised band and a bright steel ring at the centre hole | One thin painted ring near the rim, on the face |
| Change plate | A small, thin steel disc with a centre hole, in a dark black-oxide finish. Three sizes, from a saucer to a side plate | One thin painted ring near the rim |
| Hex dumbbell | A short chrome handle with diamond knurling and a six-sided black rubber head at each end | A thin ring where the handle meets each head |
| Kettlebell | A matte black cast-iron ball with a flat base and a wide loop handle, in a fine powder-coat texture | A band painted round the foot of the handle on each side |
| Half rack | Four tall black steel uprights with rows of holes, joined at the top, with a pull-up bar across the front and two horizontal safety arms | The two bar hooks |
| Bench | A black steel frame on three feet with a long black padded back and a short seat | One line of stitching round the edge of the pads |
| Lock collars | A short, wide aluminium ring that clamps round a bar, with a small black lever | The whole collar body is yellow-green; only the lever is black |

## Colours

| Name | Hex | Looks like |
|---|---|---|
| Iron black (background, products) | `#121212` | Near-black, neutral: not blue, not brown |
| Chalk white (the site's text) | `#F1EFE9` | Warm off-white. Appears in photographs only as chalk dust |
| Volt (the accent) | `#D4F000` | Vivid yellow-green, the colour of a tennis ball under bright light |

## Product shots (essential)

All landscape 4:3 except the rack. Start each with the style block.

### 1. Olympic bar
- **File:** `bar.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** One end of the barbell lying on the black floor, running diagonally from the lower right corner towards the upper left. The bright chrome sleeve is nearest the camera and sharp; behind it the thin yellow-green ring, then the black knurled shaft running away and out of the frame. Only this one end of the bar is in the picture. The yellow-green ring sits in the middle of the frame.
- **Why the ring is in the middle:** the home page shows a tall slice through the centre of this picture, and the ring where chrome meets black is what makes it read as a barbell.

### 2. Bumper plates
- **File:** `bumpers.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** Two black rubber bumper plates standing on edge on the black floor, one leaning against the other, seen three-quarters from the front so that one plain face and the thick rubber edge of each are visible. Each has one thin yellow-green ring near its rim and a bright steel ring at its centre hole. Centred, filling about 60% of the frame's height.

### 3. Steel change plates
- **File:** `change-plates.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** Three small dark steel weight plates of three different sizes lying on the black floor, fanned out and overlapping like a hand of cards, seen from above at an angle. Each has a centre hole and one thin yellow-green ring near its rim. The machining marks on the steel catch the light.

### 4. Hex dumbbells
- **File:** `dumbbells.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** A pair of hex dumbbells on the black floor, one lying flat and the other resting across it at an angle. Black six-sided rubber heads, bright chrome knurled handles, and a thin yellow-green ring where each handle meets each head. Seen three-quarters from the front, centred, filling about half the frame.

### 5. Kettlebell
- **File:** `kettlebell.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** One matte black cast-iron kettlebell standing on the black floor, turned slightly so the handle loop is seen at an angle. A yellow-green band is painted round the foot of the handle on each side. Centred, filling about 60% of the frame's height.

### 6. Half rack
- **File:** `rack.jpg`
- **Shape:** portrait, 3:4
- **Prompt:** A black steel half rack standing on the black floor, seen three-quarters from the front: four tall uprights with rows of holes, a pull-up bar across the top front, two horizontal safety arms at waist height and two yellow-green bar hooks at shoulder height. No barbell, no plates, no bench. The whole rack is in the frame, with empty black above and to each side.

### 7. Adjustable bench
- **File:** `bench.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** A black adjustable weight bench standing on the black floor, seen exactly from the side, with its back pad raised to about 45 degrees and its seat flat. Black steel frame, black padded seat and back with one line of yellow-green stitching round the edge of each pad. The whole bench is in the frame.

### 8. Lock collars
- **File:** `collars.jpg`
- **Shape:** landscape, 4:3
- **Prompt:** A pair of yellow-green anodised aluminium barbell collars on the black floor, one standing on its edge and the other lying flat beside it. Each is a short, wide ring with a small black locking lever. Seen from slightly above, centred, filling about half the frame.

## Scenes (good to have)

These do not use the style block. Start each with this line instead:

> Dark, moody photograph for a strength-equipment brand. Deep blacks, one hard light source, no colour in the frame except warm skin, pale chalk and one vivid yellow-green detail on the equipment. No text, no logos, no numbers, no lettering on any equipment, clothing or wall. No faces.

| # | File | Shape | Prompt |
|---|---|---|---|
| 9 | `drop.jpg` | landscape 16:9 | A loaded barbell caught the instant after it has been dropped on a black rubber lifting platform: three thick black bumper plates on each end, a hand's width off the floor on the bounce, the bar very slightly bent. A cloud of white chalk dust hangs in the hard side light. Seen from low down, level with the plates, with the nearest stack of plates on the right of the frame. No person in the picture. The lower left third of the frame is dark and empty. |
| 10 | `knurl.jpg` | portrait 3:4 | Extreme close-up of one chalked hand closed round the black knurled shaft of a barbell, seen from the side. Chalk fills the diamond pattern of the knurling and the creases of the knuckles. Only the hand, the wrist and a short length of bar are in the frame; the background is black. |
| 11 | `foundry.jpg` | landscape 16:9 | Inside an iron foundry: a steel ladle tipping a stream of glowing orange molten iron into a row of dark sand moulds on the floor, throwing sparks. The glow of the iron is the only light. Any worker is a distant silhouette in heavy protective clothing, seen from behind. The yellow-green rule above does not apply to this shot. |
| 12 | `garage.jpg` | landscape 16:9 | A home garage gym at night, lit by one bare overhead lamp: a black half rack with yellow-green bar hooks holding a barbell loaded with black bumper plates, a black bench under it, and a row of black hex dumbbells on the concrete floor along the wall. A closed garage door behind. No person. The lower left third of the frame is dark and empty. |

**Why two of them need an empty lower left:** a headline is set over that corner of the picture.

## Checks before saving a result

- The background of every product shot is flat black to all four edges. Reject anything with a grey gradient, a floor line, a pool of light or a reflection under the product.
- No text, logos or numbers anywhere. Generated bumper plates and dumbbells nearly always come with moulded lettering; regenerate until the faces are plain.
- Each product has its one yellow-green detail, in the place the table gives, and nothing else is coloured.
- The product's own blacks are visible: the rim light should draw a pale edge round it. A black product with no lit edge will vanish on the page.
- Shots 1, 2, 4, 5 and 6: cover the left and right thirds of the picture with your hands. What is left in the middle should still be recognisable as the product.
- Shot 2: plates are plain discs with a steel centre, not car tyres and not spoked wheels.
- Shot 6: four uprights, the whole rack in frame, nothing loaded on it.
- Shots 9 and 12: the lower left third is dark, with nothing important in it.
- Hands, where they appear, are natural: five fingers, no jewellery. No faces.
