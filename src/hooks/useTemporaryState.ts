import { useState } from 'react';

export function useTemporaryState<T>(initialValue: T, clearDelay: number = 4000) {
  const [value, setValue] = useState<T>(initialValue);

  const setTemporary = (newValue: T) => {
    setValue(newValue);
    const timer = setTimeout(() => setValue(initialValue), clearDelay);
    return () => clearTimeout(timer);
  };

  return [value, setTemporary] as const;
}
