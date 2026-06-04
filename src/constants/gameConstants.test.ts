import { describe, expect, test } from '@jest/globals';
import { getIdealDistribution, validateDistribution } from './gameConstants';

describe('Тестирование валидации распределения бюджета', () => {
  describe('getIdealDistribution', () => {
    test('возвращает идеальные значения для 200 Фини', () => {
      const ideal = getIdealDistribution(200);

      expect(ideal.needs).toBe(100);
      expect(ideal.wants).toBe(40);
      expect(ideal.savings).toBe(40);
      expect(ideal.good).toBe(20);
      expect(ideal.tolerance).toBe(10);
    });

    test('возвращает идеальные значения для 500 Фини', () => {
      const ideal = getIdealDistribution(500);

      expect(ideal.needs).toBe(250);
      expect(ideal.wants).toBe(100);
      expect(ideal.savings).toBe(100);
      expect(ideal.good).toBe(50);
      expect(ideal.tolerance).toBe(25);
    });
  });

  describe('validateDistribution', () => {
    test('одобряет идеальное распределение 200 Фини', () => {
      const covers = { needs: 100, wants: 40, savings: 40, good: 20 };
      const result = validateDistribution(covers, 200);

      expect(result.isValid).toBe(true);
    });

    test('одобряет распределение в пределах погрешности', () => {
      const covers = { needs: 105, wants: 35, savings: 45, good: 15 };
      const result = validateDistribution(covers, 200);

      expect(result.isValid).toBe(true);
    });

    test('отклоняет распределение с превышением погрешности', () => {
      const covers = { needs: 120, wants: 40, savings: 40, good: 0 };
      const result = validateDistribution(covers, 200);

      expect(result.isValid).toBe(false);
    });

    test('отклоняет распределение с неправильной суммой', () => {
      const covers = { needs: 100, wants: 40, savings: 40, good: 30 };
      const result = validateDistribution(covers, 200);

      expect(result.isValid).toBe(false);
      expect(result.message).toContain('Нужно распределить ровно 200 Фини');
    });
  });
});
