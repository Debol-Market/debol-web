import { useEffect, useState } from "react";
import { ZodSchema } from "zod";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  zodSchema: ZodSchema,
) {
  const [value, setValue] = useState<T>(() => {
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

  const updateValue = (newValue: T) => {
    setValue(newValue);
  };

  const clearValue = () => {
    setValue(initialValue);
  };

  return [value, updateValue, clearValue] as [
    T,
    (newValue: T) => void,
    VoidFunction,
  ];
}

export default useLocalStorage;
