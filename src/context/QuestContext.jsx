import { createContext, useEffect, useState } from 'react';
import { quests } from '../data/quests';

export const QuestContext = createContext();

const LEVEL_STEP = 100;

export const QuestProvider = ({ children }) => {
  // 1. Загружаем сохранённый прогресс
  const saved = JSON.parse(localStorage.getItem('questProgress') || '{}');

  // 2. Основные состояния
  const safeBalance =
    typeof saved.balance === 'number' && !Number.isNaN(saved.balance) ? saved.balance : 0;

  const [balance, setBalance] = useState(safeBalance);
  const [completedQuests, setCompletedQuests] = useState(saved.completedQuests ?? []);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  useEffect(() => {
    console.log('BALANCE:', balance);
  }, [balance]);
  // 3. Сохраняем прогресс
  useEffect(() => {
    localStorage.setItem('questProgress', JSON.stringify({ balance, completedQuests }));
  }, [balance, completedQuests]);

  // 4. Уровень и прогресс
  const level = Math.floor(balance / LEVEL_STEP);
  const progress = (balance % LEVEL_STEP) / LEVEL_STEP;

  // 5. Активный квест (если есть)
  const currentQuest = quests.find(q => q.id === currentQuestId) ?? null;

  // 6. Следующий доступный квест
  const nextQuest = quests.find(q => !completedQuests.includes(q.id)) ?? null;

  // 7. Завершение квеста
  const completeQuest = questId => {
    if (completedQuests.includes(questId)) return;
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    setCompletedQuests(prev => [...prev, questId]);
    setBalance(prev => {
      const safePrev = Number.isFinite(prev) ? prev : 0;
      return safePrev + quest.reward;
    });
    setCurrentQuestId(null);
  };

  return (
    <QuestContext.Provider
      value={{
        balance,
        level,
        progress,

        completedQuests,

        currentQuest,
        nextQuest,

        completeQuest,
        setCurrentQuestId,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
