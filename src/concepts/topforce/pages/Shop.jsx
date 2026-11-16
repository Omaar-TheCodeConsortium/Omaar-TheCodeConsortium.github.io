import { Link } from 'react-router-dom';
import { Shelf, Shot } from '../Media.jsx';
import { CATEGORIES, PRODUCTS, productsIn } from '../catalog.js';
import { BASE } from '../site.js';

export default function Shop() {
  return (
    <div className="tf-shop">
      <header className="tf-page-head">
        <h1 className="tf-mega">The whole floor.</h1>
        <div className="tf-page-head-side">
          <p className="tf-lede">
            {PRODUCTS.length} products in {CATEGORIES.length} groups. Anything sold by weight shows its price per
            kilogram, so a 5 kg plate and a 25 kg plate cost the same per kilo.
          </p>
          <nav aria-label="Product groups" className="tf-jump">
            {CATEGORIES.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.name}
                <span aria-hidden="true">{productsIn(category.id).length}</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {CATEGORIES.map((category) => (
        <section key={category.id} id={category.id} className="tf-cat" aria-labelledby={`tf-cat-${category.id}`}>
          <header className="tf-cat-head">
            <h2 id={`tf-cat-${category.id}`} className="tf-cat-name">
              {category.name}
            </h2>
            <p>{category.line}</p>
            <span className="tf-label">
              {productsIn(category.id).length} {productsIn(category.id).length === 1 ? 'product' : 'products'}
            </span>
          </header>
          <ul>
            {productsIn(category.id).map((product) => (
              <li key={product.slug}>
                <Shelf product={product} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="tf-drop" aria-labelledby="tf-shop-cta">
        <Shot
          name="garage"
          alt="A garage gym at night: a black half rack holding a loaded barbell, a bench beneath it and dumbbells along the wall"
        />
        <div className="tf-drop-text">
          <h2 id="tf-shop-cta" className="tf-h2">
            Buying a bar and plates together?
          </h2>
          <p className="tf-lede">Load them in the set builder. From 100 kg of plates, the plates cost 8% less.</p>
          <Link to={`${BASE}build/`} className="tf-btn tf-btn--volt justify-self-start">
            Open the set builder
          </Link>
        </div>
      </section>
    </div>
  );
}
