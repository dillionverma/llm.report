import { useEffect, useState } from "react";

const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  poll: boolean = false
): [T | null, (value: T) => void] => {
  const [value, setValue] = useState<T | null>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue ?? null;
    } else {
      return initialValue ?? null;
    }
  });

  // Listen to storage change events (changes from other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(
          event.newValue ? JSON.parse(event.newValue) : initialValue ?? null
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue, value]);

  // Listen to storage change events (changes from current tab)
  useEffect(() => {
    if (!poll) return;
    let prevValue = value;
    const intervalId = setInterval(() => {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null && storedValue !== prevValue) {
        prevValue = JSON.parse(storedValue);
        setValue(JSON.parse(storedValue));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
