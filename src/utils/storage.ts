import { QUEST_POSITIONS } from '../constants/gameConstants';
import { UserProgress } from '../types/quest.types';

// Типы для ключей localStorage
type SessionKey = 'checkingDistribution';

//ключи для хранения данных
const STORAGE_KEYS = {
  //постоянное хранение
  QUEST_PROGRESS: 'questProgress',
  USER_TOKEN: 'userToken',
  USER_ID: 'userId',

  //временное хранение, до закрытия вкладки
  CHECKING_DISTRIBUTION: 'checkingDistribution',
} as const;

export const saveProgress = (data: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEST_PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
  }
};

export const loadProgress = (): UserProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QUEST_PROGRESS);
    return saved ? JSON.parse(saved) : ({} as UserProgress);
  } catch (error) {
    console.error('Ошибка загрузки прогресса:', error);
    return {} as UserProgress;
  }
};

export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUEST_PROGRESS);
  } catch (error) {
    console.error('Ошибка очистки прогресса:', error);
  }
};

export const saveProgressField = <K extends keyof UserProgress>(
  key: K,
  value: UserProgress[K]
): void => {
  const progress = loadProgress();
  progress[key] = value;
  saveProgress(progress);
};

export const loadProgressField = <K extends keyof UserProgress>(
  key: K
): UserProgress[K] | undefined => {
  const progress = loadProgress();
  return progress[key];
};

export const setFlag = (flag: SessionKey): void => {
  try {
    sessionStorage.setItem(flag, 'true');
  } catch (error) {
    console.error('Ошибка установки флага:', error);
  }
};

export const getFlag = (flag: SessionKey): boolean => {
  try {
    return sessionStorage.getItem(flag) === 'true';
  } catch (error) {
    console.error('Ошибка проверки флага:', error);
    return false;
  }
};

export const removeFlag = (flag: SessionKey): void => {
  try {
    sessionStorage.removeItem(flag);
  } catch (error) {
    console.error('Ошибка удаления флага:', error);
  }
};

export const setCheckingDistribution = (): void => {
  sessionStorage.setItem(STORAGE_KEYS.CHECKING_DISTRIBUTION, 'true');
};

export const isCheckingDistribution = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.CHECKING_DISTRIBUTION) === 'true';
};

export const clearCheckingDistribution = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.CHECKING_DISTRIBUTION);
};

export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
  } catch (error) {
    console.error('Ошибка сохранения токена:', error);
  }
};

export const loadToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Ошибка загрузки токена:', error);
    return null;
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
  } catch (error) {
    console.error('Ошибка удаления токена:', error);
  }
};

export const isAuthenticated = () => {
  return !!loadToken();
};

export const getQuestPosition = (id: number): { x: string; y: string } => {
  if (id <= 12) return QUEST_POSITIONS[id - 1];
  const index = (id - 1) % 12;
  return QUEST_POSITIONS[index];
};
