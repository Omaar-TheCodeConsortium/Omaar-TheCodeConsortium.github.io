import { useState } from 'react';
import { Fabric, Photo } from '../Fabric.jsx';
import { WHOLESALE_TIERS } from '../products.js';

const TERMS = [
  { term: 'Stock colours', detail: 'All eight dyes are held in stock in every size. Orders leave the mill within seven working days.' },
  { term: 'Custom colours', detail: 'We dye to your Pantone reference in lots of 300 metres. Allow 25 working days, plus a lab dip for approval.' },
  { term: 'Your label', detail: 'Woven neck labels, care labels and swing tags from 200 pieces. Send artwork, or we set it for you.' },
  { term: 'Packing', detail: 'Folded in a linen drawstring bag as standard. Printed boxes and retail-ready barcoding on request.' },
  { term: 'Shipping', detail: 'FOB Ningbo, or delivered duty-paid to your door in the EU, the UK, the US and Canada.' },
  { term: 'Payment', detail: '30% with the order, 70% before shipment. Net 30 from the third order.' },
  { term: 'Samples', detail: 'A swatch card of all eight dyes and one pillowcase for $25, credited against your first order.' },
];

const SHOP_TYPES = ['Independent shop', 'Online store', 'Hotel or rental', 'Interior designer', 'Department store or chain'];
const VOLUMES = ['40 to 199 pieces', '200 to 999 pieces', '1,000 pieces or more', 'Not sure yet'];

export default function Wholesale() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="px-[var(--pad)] pb-[clamp(30px,4vw,70px)] pt-[clamp(120px,13vw,220px)]">
        <h1 className="sl-display text-[clamp(3rem,10.6vw,12.5rem)]">
          Wholesale and <em>private label.</em>
        </h1>
        <p className="mt-[clamp(20px,2.4vw,40px)] max-w-[54ch] text-[1.1em]">
          We wove for other people’s brands for twenty years before we had our own, so we know what a buyer needs from
          a mill: the same shade in March as in September, and an honest date.
        </p>
      </section>

      <section aria-labelledby="sl-tiers">
        <h2 id="sl-tiers" className="sr-only">
          Discount by order size
        </h2>
        <div className="sl-rows">
          {WHOLESALE_TIERS.map((tier) => (
            <div key={tier.from} className="sl-row border-t border-[color:color-mix(in_srgb,var(--ink)_18%,transparent)]">
              <p className="sl-display sl-row-big">{tier.off}%</p>
              <p className="sl-serif sl-row-mid">
                off retail,
                <br />
                from {tier.from.toLocaleString('en-US')} pieces
              </p>
              <p className="max-w-[30ch] text-[1.1em]">{tier.note}</p>
            </div>
          ))}
        </div>
      </section>

      <Photo
        name="wholesale-bolts"
        dye="soot"
        variant="deep"
        className="h-[min(70vh,760px)] w-full"
        alt="Rolls of linen in six colours stacked on steel warehouse shelving"
        stack={['indigo', 'madder', 'sage', 'ochre', 'oat', 'lake', 'chalk']}
      />

      <section className="sl-split !min-h-0" aria-labelledby="sl-terms">
        <div className="px-[var(--pad)] py-[clamp(50px,7vw,120px)]">
          <h2 id="sl-terms" className="sl-display text-[clamp(2.4rem,5.6vw,6.4rem)]">
            The terms, <em>in full</em>
          </h2>
          <dl className="mt-[clamp(24px,3vw,50px)] grid gap-6">
            {TERMS.map((item) => (
              <div key={item.term} className="grid gap-x-8 gap-y-1 sm:grid-cols-[11rem_1fr]">
                <dt className="sl-serif text-[1.35em]">{item.term}</dt>
                <dd className="sl-soft max-w-[46ch]">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Fabric variant="deep" className="px-[var(--pad)] py-[clamp(50px,7vw,120px)]">
          <h2 className="sl-display text-[clamp(2.4rem,5.6vw,6.4rem)]">
            Ask for <em>a sample kit</em>
          </h2>
          {sent ? (
            <div role="status" className="mt-[clamp(24px,3vw,50px)] grid gap-5">
              <p className="sl-serif max-w-[18ch] text-[clamp(1.6rem,3vw,3.2rem)]">This is where your request would be on its way.</p>
              <p className="max-w-[44ch]">
                Sunloom International is a concept site, so nothing has been sent or stored. On a live site our
                wholesale desk would reply within one working day with a price list and a sample kit invoice.
              </p>
              <button type="button" className="sl-btn sl-btn--on-dye w-fit" onClick={() => setSent(false)}>
                Start again
              </button>
            </div>
          ) : (
            <form
              className="mt-[clamp(24px,3vw,50px)] grid gap-7"
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
            >
              <label className="sl-field">
                <span>Business name</span>
                <input className="sl-input" name="business" autoComplete="organization" placeholder="Your shop or company" required />
              </label>
              <label className="sl-field">
                <span>What kind of business?</span>
                <select className="sl-input" name="type" defaultValue={SHOP_TYPES[0]}>
                  {SHOP_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="sl-field">
                <span>How much per order?</span>
                <select className="sl-input" name="volume" defaultValue={VOLUMES[0]}>
                  {VOLUMES.map((volume) => (
                    <option key={volume}>{volume}</option>
                  ))}
                </select>
              </label>
              <label className="sl-field">
                <span>Where do you sell?</span>
                <input className="sl-input" name="country" autoComplete="country-name" placeholder="Country" required />
              </label>
              <button type="submit" className="sl-btn sl-btn--on-dye w-fit">
                Request the sample kit
              </button>
            </form>
          )}
        </Fabric>
      </section>
    </>
  );
}
