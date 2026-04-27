//ключи для хранения данных
const STORAGE_KEYS = {
  //постоянное хранение
  QUEST_PROGRESS: 'questProgress',
  USER_TOKEN: 'userToken',
  USER_ID: 'userId',

  //временное хранение, до закрытия вкладки
  CHECKING_DISTRIBUTION: 'checkingDistribution',
};

export const saveProgress = data => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEST_PROGRESS, JSON.stringify(data));
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
  }
};

export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.QUEST_PROGRESS);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Ошибка загрузки прогресса:', error);
    return {};
  }
};

export const clearProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUEST_PROGRESS);
  } catch (error) {
    console.error('Ошибка очистки прогресса:', error);
  }
};

export const saveProgressField = (key, value) => {
  const progress = loadProgress();
  progress[key] = value;
  saveProgress(progress);
};

export const loadProgressField = (key, defaultValue = null) => {
  const progress = loadProgress();
  return progress[key] !== undefined ? progress[key] : defaultValue;
};

export const setFlag = flag => {
  try {
    sessionStorage.setItem(flag, 'true');
  } catch (error) {
    console.error('Ошибка установки флага:', error);
  }
};

export const getFlag = flag => {
  try {
    return sessionStorage.getItem(flag) === 'true';
  } catch (error) {
    console.error('Ошибка проверки флага:', error);
    return false;
  }
};

export const removeFlag = flag => {
  try {
    sessionStorage.removeItem(flag);
  } catch (error) {
    console.error('Ошибка удаления флага:', error);
  }
};

export const setCheckingDistribution = () => {
  setFlag(STORAGE_KEYS.CHECKING_DISTRIBUTION);
};

export const isCheckingDistribution = () => {
  return getFlag(STORAGE_KEYS.CHECKING_DISTRIBUTION);
};

export const clearCheckingDistribution = () => {
  removeFlag(STORAGE_KEYS.CHECKING_DISTRIBUTION);
};

export const saveToken = token => {
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
