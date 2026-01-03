import { useEffect, useState } from 'react';

export function createBreakpoints<T extends Record<string, number>>(breakpoints: T): () => keyof T {
  return function () {
    const [breakpoint, setBreakpoint] = useState<keyof T>('');
    useEffect(() => {
      function updateBreakpoints() {
        const keys = Object.keys(breakpoints);
        keys.sort((a, b) => breakpoints[b] - breakpoints[a]);
        const width = window.innerWidth;
        for (const key of keys) {
          if (width >= breakpoints[key]) {
            setBreakpoint(key);
            return;
          }
        }
      }
      window.addEventListener('resize', updateBreakpoints);
      return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return breakpoint;
  };
}

export const useBreakpoints = createBreakpoints({
  mobile: 0,
  tablet: 768,
  desktop: 1024,
});
