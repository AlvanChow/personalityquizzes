import { useEffect } from 'react';

/** Sets document.title for the page (browser tab, history, screen readers). */
export function usePageTitle(title) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
