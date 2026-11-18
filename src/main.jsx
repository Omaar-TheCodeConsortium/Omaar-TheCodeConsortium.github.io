import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

// GitHub Pages answers an address it has no file for with 404.html, which sends the visitor to
// the home page and puts the address back (see index.html). The HTML that arrives is then the
// pre-rendered home page, so it is only reused when it was written for the address in the bar.
const withSlash = (path) => (path.endsWith('/') ? path : `${path}/`)
const prerendered = container.dataset.prerendered
if (prerendered && prerendered !== withSlash(window.location.pathname)) container.replaceChildren()
document.documentElement.classList.remove('spa-redirect')

// True until the visitor first navigates. Intro animations check it so they do not replay
// over content that was already on screen in the pre-rendered HTML.
window.__TCC_FIRST_PAINT__ = container.hasChildNodes()

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Pages pre-rendered at build time already contain their HTML, so React attaches to it.
// Every other page starts from an empty root, as before.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
