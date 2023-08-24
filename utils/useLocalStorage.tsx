import { useEffect, useState } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void, VoidFunction] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window == "undefined") return initialValue;
    const storedValue = localStorage?.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
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

  return [value, updateValue, clearValue];
}

export default useLocalStorage;
