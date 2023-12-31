import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window == "undefined") return initialValue;

    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return initialValue;
      JSON.parse(storedValue);
      return storedValue ? JSON.parse(storedValue) : initialValue;
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
