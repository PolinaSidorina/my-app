import { useContext } from 'react';
import {
  BUDGET_RULES,
  getIdealDistribution as getIdealDistributionUtil,
  validateDistribution as validateDistributionUtil,
} from '../constants/gameConstants';
import { QuestContext } from '../context/QuestContext';
import { Covers, IdealDistribution, ValidationResult } from '../types/quest.types';

export const useQuestValidation = () => {
  const context = useContext(QuestContext);
  //проверяет распределение фини
  const validate = (covers: Covers, totalAmount: number): ValidationResult => {
    return validateDistributionUtil(covers, totalAmount);
  };
  //возвращает идеальное распределение для суммы
  const getIdeal = (totalAmount: number): IdealDistribution => {
    return getIdealDistributionUtil(totalAmount);
  };
  //проверяет есть ли накопления
  const hasSavings = (covers: Covers): boolean => {
    return covers.savings > 0;
  };
  //вычисляет процент накоплений от общей суммы
  const getSavingsPercent = (covers: Covers): number => {
    const total = covers.needs + covers.wants + covers.savings + covers.good;
    if (total === 0) return 0;
    return Math.round((covers.savings / total) * 100);
  };

  return {
    validate,
    getIdeal,
    hasSavings,
    getSavingsPercent,
    rules: BUDGET_RULES,
    context,
  };
};
