import { useLocation } from 'react-router-dom';
import { useTradewin } from './tradewinContext.js';
import { twinOf } from './site.js';

// A link to this same page on the other side: Direct to Wholesale, or back. A plain click flips
// the page in place; a new-tab or modified click is left to the browser.
export default function FlipLink({ children, ...rest }) {
  const { pathname } = useLocation();
  const { flip } = useTradewin();

  const onClick = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    flip();
  };

  return (
    <a href={twinOf(pathname)} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
