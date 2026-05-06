// src/hooks/useLocalStorage.ts
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UserProgress } from '../types/quest.types';
import { loadProgressField, saveProgressField } from '../utils/storage';

export const useLocalStorage = <K extends keyof UserProgress>(
  key: K,
  initialValue: UserProgress[K]
): [UserProgress[K], Dispatch<SetStateAction<UserProgress[K]>>] => {
  const [value, setValue] = useState<UserProgress[K]>(() => {
    const saved = loadProgressField(key);
    if (saved !== null && saved !== undefined) {
      return saved as UserProgress[K];
    }
    if (typeof initialValue === 'function') {
      return (initialValue as () => UserProgress[K])();
    }
    return initialValue;
  });

  useEffect(() => {
    saveProgressField(key, value);
  }, [key, value]);

  return [value, setValue];
};
