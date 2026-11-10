import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getMeta } from './meta.js';

// Tags this hook owns carry data-seo, so it can update the pre-rendered ones in place
// and remove them again when the visitor moves to a page outside the concept section.
function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  return el;
}

const metaTag = (attr, key) => () => {
  const el = document.createElement('meta');
  el.setAttribute(attr, key);
  return el;
};

export function useSeo() {
  const { pathname } = useLocation();
  const firstPath = useRef(pathname);

  useEffect(() => {
    // See src/main.jsx: after the first navigation, pages are no longer "already painted".
    if (pathname !== firstPath.current) window.__TCC_FIRST_PAINT__ = false;

    const meta = getMeta(pathname);

    if (!meta) {
      document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
      return;
    }

    document.title = meta.title;
    upsert('meta[name="description"]', metaTag('name', 'description')).setAttribute('content', meta.description);
    upsert('meta[name="robots"]', metaTag('name', 'robots')).setAttribute('content', meta.robots);
    upsert('meta[property="og:title"]', metaTag('property', 'og:title')).setAttribute('content', meta.title);
    upsert('meta[property="og:description"]', metaTag('property', 'og:description')).setAttribute('content', meta.description);
    upsert('meta[property="og:url"]', metaTag('property', 'og:url')).setAttribute('content', meta.canonical);
    upsert('meta[property="og:type"]', metaTag('property', 'og:type')).setAttribute('content', meta.ogType);

    upsert('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    }).setAttribute('href', meta.canonical);

    upsert('script[type="application/ld+json"][data-seo]', () => {
      const el = document.createElement('script');
      el.setAttribute('type', 'application/ld+json');
      return el;
    }).textContent = JSON.stringify(meta.jsonLd);
  }, [pathname]);
}
