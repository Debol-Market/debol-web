import { useEffect, useState } from "react";
import { ZodSchema } from "zod";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  zodSchema: ZodSchema,
) {
  const [value, updateValue] = useState<T>(() => {
    if (typeof window == "undefined") return initialValue;

    try {
      const storedValue = localStorage.getItem(key);
      const d = zodSchema.parse(JSON.parse(storedValue ?? ""));
      return d;
      // return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window == "undefined") return;
    localStorage?.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const clearValue = () => {
    updateValue(initialValue);
  };

  return [value, updateValue, clearValue] as const;
}

export default useLocalStorage;
