import { FORMS_URL } from './config.js';

// Sends a form to the Worker. Resolves to { ok, error?, reference? } and never throws.
export async function sendForm(path, body) {
  try {
    const response = await fetch(`${FORMS_URL}${path}`, { method: 'POST', body });
    const result = await response.json().catch(() => ({}));
    if (response.ok && result.ok) return result;
    return { ok: false, error: result.error ?? 'That didn’t send. Please try again in a moment.' };
  } catch {
    return { ok: false, error: 'We couldn’t reach our server. Check your connection and try again.' };
  }
}
