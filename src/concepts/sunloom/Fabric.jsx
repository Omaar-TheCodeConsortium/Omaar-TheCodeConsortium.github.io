import { DYES, dyeById } from './products.js';

// Photographs are picked up by file name from ./photos. See docs/sunloom-shot-list.md.
const files = import.meta.glob('./photos/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const PHOTOS = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace('./photos/', '').replace(/\.[a-z]+$/, ''), url]),
);

const dyeVars = (dyeId) => {
  if (!dyeId) return undefined;
  const dye = dyeById(dyeId);
  return { '--dye': dye.hex, '--on-dye': dye.on };
};

// A field of dyed linen. Without `dye` it takes the colour the site is currently dyed in.
export function Fabric({ dye, variant = 'drape', className = '', style, children, ...rest }) {
  return (
    <div className={`sl-fabric sl-fabric--${variant} ${className}`} style={{ ...dyeVars(dye), ...style }} {...rest}>
      {children}
    </div>
  );
}

// A stack of folded linen, one fold per dye. Decorative: the caption beside it carries the meaning.
export function FoldedStack({ dyes, className = '' }) {
  return (
    <div className={`sl-stack ${className}`} aria-hidden="true">
      {dyes.map((id, index) => (
        <span
          key={`${id}-${index}`}
          className="sl-fold sl-fabric sl-fabric--flat"
          style={{ ...dyeVars(id), '--i': index, '--n': dyes.length }}
        />
      ))}
    </div>
  );
}

// A picture slot. Shows the photograph if one has been supplied; otherwise dyed linen drawn in code,
// with a folded stack when `stack` is given. `tint` re-colours an off-white product photograph.
// `tall` names a portrait version of the same picture for narrow screens.
export function Photo({ name, tall, alt, dye, tint = false, stack, variant = 'drape', position, className = '', loading = 'lazy' }) {
  const src = PHOTOS[name];

  if (!src) {
    return (
      <Fabric dye={dye} variant={variant} className={`sl-photo sl-photo--drawn ${className}`} role="img" aria-label={alt}>
        {stack && <FoldedStack dyes={stack} />}
      </Fabric>
    );
  }

  const imgStyle = position ? { objectPosition: position } : undefined;

  return (
    <div className={`sl-photo ${tint ? 'sl-photo--tint' : ''} ${className}`} style={dyeVars(dye)}>
      <picture>
        {PHOTOS[tall] && <source media="(max-width: 700px)" srcSet={PHOTOS[tall]} />}
        <img src={src} alt={alt} loading={loading} decoding="async" style={imgStyle} />
      </picture>
      {/* A second copy lifts the highlights, so dyed cloth keeps its folds instead of going flat. */}
      {tint && <img src={src} alt="" aria-hidden="true" className="sl-photo-lift" loading={loading} decoding="async" style={imgStyle} />}
    </div>
  );
}

// Lies over a photograph and re-dyes its cloth. It needs a "<name>-cloth" file beside the
// photograph (written by scripts/process-photos.mjs). Hidden while `dye` is the colour the
// cloth was photographed in.
export function Redye({ name, tall, dye, shotIn }) {
  const cloth = PHOTOS[`${name}-cloth`];
  if (!cloth) return null;
  const clothTall = PHOTOS[`${tall}-cloth`] ?? cloth;

  return (
    <div
      className="sl-redye"
      aria-hidden="true"
      data-on={dye !== shotIn}
      style={{ ...dyeVars(dye), '--cloth': `url("${cloth}")`, '--cloth-tall': `url("${clothTall}")` }}
    />
  );
}

// Round dye swatches. `onPick` receives the dye id.
export function Swatches({ ids = DYES.map((dye) => dye.id), value, onPick, label, size = 'md', className = '' }) {
  return (
    <div role="group" aria-label={label} className={`sl-swatches sl-swatches--${size} ${className}`}>
      {ids.map((id) => {
        const dye = dyeById(id);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            aria-label={dye.name}
            title={dye.name}
            className="sl-swatch"
            style={{ '--swatch': dye.hex }}
            onClick={() => onPick(id)}
          />
        );
      })}
    </div>
  );
}
