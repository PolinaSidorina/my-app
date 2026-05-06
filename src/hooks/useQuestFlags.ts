import { useEffect, useState } from 'react';
import {
  clearCheckingDistribution,
  isCheckingDistribution,
  setCheckingDistribution,
} from '../utils/storage';
import { QuestFlags } from '../types/quest.types';

export const useQuestFlags = (): QuestFlags => {
  const [isChecking, setIsChecking] = useState<boolean>(() => isCheckingDistribution());

  useEffect(() => {
    const interval = setInterval(() => {
      const current = isCheckingDistribution();
      if (current !== isChecking) setIsChecking(current);
    }, 100);
    return () => clearInterval(interval);
  }, [isChecking]);

  const startCheck = (): void => {
    setCheckingDistribution();
    setIsChecking(true);
  };

  const stopCheck = (): void => {
    clearCheckingDistribution();
    setIsChecking(false);
  };

  return {
    isChecking,
    stopCheck,
    startCheck,
  };
};
