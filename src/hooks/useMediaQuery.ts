import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    const updateMatch = (event: MediaQueryListEvent) => setMatches(event.matches);
    // Set the initial state
    setMatches(media.matches);

    // Use the modern API for event listeners
    media.addEventListener('change', updateMatch);

    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
