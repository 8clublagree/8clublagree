import { useEffect, useState } from "react";

type UseDebounceReturn<T> = {
  debouncedValue: T;
  loading: boolean;
};

export default function useDebounce<T>(
  value: T,
  delay?: number
): UseDebounceReturn<T> {
  const [loading, setLoading] = useState<boolean>(false);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return { debouncedValue, loading };
}
