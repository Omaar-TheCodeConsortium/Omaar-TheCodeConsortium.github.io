// Where the website's forms are sent, and the public key for the "are you a person" check.
// The Worker that receives them is in worker/ (see worker/README.md).
// Both can be overridden for local testing with VITE_FORMS_URL and VITE_TURNSTILE_SITE_KEY.

export const FORMS_URL = import.meta.env.VITE_FORMS_URL || 'https://forms.thecodeconsortium.com';

// The Turnstile site key is public by design. Until the real one is set, this is Cloudflare's
// test key, which always passes in the browser but is refused by the live Worker.
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
