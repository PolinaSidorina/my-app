import { beforeEach, describe, expect, test } from '@jest/globals';
import '@testing-library/jest-dom';
import { clearProgress, loadProgress, saveProgress } from './storage';

describe('Утилиты storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saveProgress сохраняет данные в localStorage', () => {
    const testData = {
      balance: 100,
      budget: 50,
      covers: { needs: 0, wants: 0, savings: 0, good: 0 },
      completedQuests: [],
      goal: null,
      currentQuestId: null,
      questProgressMap: {},
      actionState: {},
      activeHighlight: null,
    };
    saveProgress(testData);

    const saved = localStorage.getItem('questProgress');
    expect(saved).toBe(JSON.stringify(testData));
  });

  test('loadProgress загружает данные из localStorage', () => {
    const testData = {
      balance: 100,
      budget: 50,
      covers: { needs: 0, wants: 0, savings: 0, good: 0 },
      completedQuests: [],
      goal: null,
      currentQuestId: null,
      questProgressMap: {},
      actionState: {},
      activeHighlight: null,
    };
    localStorage.setItem('questProgress', JSON.stringify(testData));

    const loaded = loadProgress();
    expect(loaded).toEqual(testData);
  });

  test('loadProgress возвращает пустой объект, если данных нет', () => {
    const loaded = loadProgress();
    expect(loaded).toEqual({});
  });

  test('clearProgress удаляет данные из localStorage', () => {
    localStorage.setItem('questProgress', '{"balance":100}');
    clearProgress();

    expect(localStorage.getItem('questProgress')).toBeNull();
  });
});
