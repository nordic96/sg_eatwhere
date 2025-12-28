import { useEffect, useState } from 'react';

export function useDebounce<T = unknown>(value: T, delay: number) {
  const [val, setVal] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setVal(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return val;
}
