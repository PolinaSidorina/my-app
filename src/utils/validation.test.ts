import { describe, expect, test } from '@jest/globals';
import { getIdealDistribution, validateDistribution } from '../constants/gameConstants';

describe('Валидация распределения бюджета', () => {
  describe('getIdealDistribution', () => {
    test('идеальные значения для 200 Фини', () => {
      const ideal = getIdealDistribution(200);
      expect(ideal.needs).toBe(100);
      expect(ideal.wants).toBe(40);
      expect(ideal.savings).toBe(40);
      expect(ideal.good).toBe(20);
    });
  });

  describe('validateDistribution', () => {
    test('идеальное распределение проходит проверку', () => {
      const covers = { needs: 100, wants: 40, savings: 40, good: 20 };
      const result = validateDistribution(covers, 200);
      expect(result.isValid).toBe(true);
    });

    test('неправильное распределение не проходит', () => {
      const covers = { needs: 150, wants: 30, savings: 10, good: 10 };
      const result = validateDistribution(covers, 200);
      expect(result.isValid).toBe(false);
    });
  });
});
