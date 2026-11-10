import { Link } from 'react-router-dom';
import { Fabric, Photo } from '../Fabric.jsx';
import { MILL_CHAPTERS } from '../products.js';
import { BASE } from '../site.js';

// Chapters with a photograph; the rest show a pattern drawn over fabric. The flax field opens the page.
const CHAPTER_PHOTOS = {
  weave: { name: 'mill-loom', alt: 'An industrial rapier loom weaving undyed linen, warp threads running into the frame' },
  sew: { name: 'detail-buttons', alt: 'The foot of an undyed linen duvet cover, closed with a row of coconut-shell buttons' },
  wash: { name: 'mill-wash', alt: 'Lengths of wet undyed linen hanging to dry from overhead rails in a tall factory hall' },
};
const CHAPTER_DYES = ['sage', 'oat', 'chalk', 'indigo', 'lake', 'madder'];

export default function Mill() {
  return (
    <>
      <section className="sl-hero sl-hero--field">
        <div className="sl-hero-media">
          <Photo
            name="flax-field"
            dye="sage"
            variant="deep"
            loading="eager"
            position="center bottom"
            alt="A flax field in northern France in early summer, pale blue flowers under an overcast sky"
          />
        </div>
        <div className="sl-hero-body">
          <div>
            <h1 className="sl-display">
              From flax field <em>to folded sheet.</em>
            </h1>
            <p className="mt-[clamp(20px,2.4vw,40px)] max-w-[52ch] text-[1.1em]">
              Six steps, four of them under our own roof. We own the looms, the dye house, the wash floor and the
              sewing room, which is why we can tell you what happened to your sheets at every one of them.
            </p>
          </div>
        </div>
      </section>

      {MILL_CHAPTERS.map((chapter, index) => {
        const photo = CHAPTER_PHOTOS[chapter.id];
        return (
          <section key={chapter.id} className="sl-chapter" aria-labelledby={`sl-mill-${chapter.id}`}>
            <div className="sl-chapter-media">
              {photo ? (
                <Photo name={photo.name} alt={photo.alt} dye={CHAPTER_DYES[index]} variant="deep" className={`sl-pattern sl-pattern--${chapter.pattern}`} />
              ) : (
                <Fabric dye={CHAPTER_DYES[index]} variant="deep" className={`sl-pattern sl-pattern--${chapter.pattern}`} aria-hidden="true" />
              )}
            </div>
            <div className="sl-chapter-body">
              <p className="flex items-baseline justify-between gap-6">
                <span>
                  {String(index + 1).padStart(2, '0')} of {String(MILL_CHAPTERS.length).padStart(2, '0')}
                </span>
                <span className="sl-soft">{chapter.place}</span>
              </p>
              <div>
                <p className="sl-display sl-chapter-figure" aria-hidden="true">
                  {chapter.figure}
                </p>
                <p className="mt-3">
                  <span className="sr-only">{chapter.figure} </span>
                  {chapter.unit}
                </p>
              </div>
              <div>
                <h2 id={`sl-mill-${chapter.id}`} className="sl-display text-[clamp(2.4rem,5vw,5.6rem)]">
                  {chapter.title}
                </h2>
                <p className="mt-5 max-w-[50ch] text-[1.08em]">{chapter.text}</p>
              </div>
            </div>
          </section>
        );
      })}

      <section className="grid gap-8 px-[var(--pad)] py-[clamp(80px,12vw,200px)]" aria-labelledby="sl-mill-next">
        <h2 id="sl-mill-next" className="sl-display max-w-[14ch] text-[clamp(2.6rem,8vw,9rem)]">
          Then it goes <em>in a box, to you.</em>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link to={`${BASE}collection/`} className="sl-btn sl-btn--dye">
            Shop the linen
          </Link>
          <Link to={`${BASE}wholesale/`} className="sl-btn">
            Buy wholesale
          </Link>
        </div>
      </section>
    </>
  );
}
