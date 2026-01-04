import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

type Breakpoint = Record<string, number>;
const DEBOUNCE_DELAY = 100;
export function createBreakpoints<T extends Breakpoint>(breakpoints: T): () => keyof T {
  const keys = Object.keys(breakpoints);
  keys.sort((a, b) => breakpoints[b] - breakpoints[a]);

  function getBreakpointFromWidth(width: number): keyof T {
    for (const key of keys) {
      if (width >= breakpoints[key]) {
        return key;
      }
    }
    throw new Error('cannot find breakpoints');
  }

  return function () {
    const [breakpoint, setBreakpoint] = useState<keyof T>('desktop');
    const debouncedBreakpoint = useDebounce(breakpoint, DEBOUNCE_DELAY);

    useEffect(() => {
      const updateBreakpoints = () => {
        const width = window.innerWidth;
        setBreakpoint(getBreakpointFromWidth(width));
      };

      updateBreakpoints();
      window.addEventListener('resize', updateBreakpoints);
      return () => window.removeEventListener('resize', updateBreakpoints);
    }, []);

    return debouncedBreakpoint;
  };
}

export const useBreakpoints = createBreakpoints({
  mobile: 0,
  tablet: 768,
  desktop: 1024,
});
