import { useEffect, useRef } from 'react';
import { TURNSTILE_SITE_KEY } from './config.js';

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      loading = null;
      reject(new Error('Turnstile did not load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

// Cloudflare's check that the visitor is a person. Usually invisible; it only asks for a click
// when it is unsure. onToken receives the pass to send with the form, or '' when it expires.
// Changing `round` resets it, since each pass can be used once.
export default function Turnstile({ onToken, round = 0, className = '' }) {
  const box = useRef(null);
  const widget = useRef(null);
  const report = useRef(onToken);
  useEffect(() => {
    report.current = onToken;
  });

  useEffect(() => {
    let gone = false;
    loadTurnstile()
      .then((turnstile) => {
        if (gone || !box.current) return;
        widget.current = turnstile.render(box.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: 'interaction-only',
          theme: 'light',
          callback: (token) => report.current(token),
          'expired-callback': () => report.current(''),
          'error-callback': () => report.current(''),
        });
      })
      .catch(() => report.current(''));
    return () => {
      gone = true;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, []);

  useEffect(() => {
    if (round > 0 && widget.current !== null) {
      report.current('');
      window.turnstile?.reset(widget.current);
    }
  }, [round]);

  return <div ref={box} className={className} />;
}
