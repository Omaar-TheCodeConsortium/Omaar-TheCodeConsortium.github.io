import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')

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
