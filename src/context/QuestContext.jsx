import { createContext, useEffect, useState } from 'react';

export const QuestContext = createContext();

const LEVEL_STEP = 100;

export const QuestProvider = ({ children }) => {
  const saved = JSON.parse(localStorage.getItem('questProgress') || '{}');

  const [balance, setBalance] = useState(saved.balance ?? 0);
  const [completedQuests, setCompletedQuests] = useState(saved.completedQuests ?? []);

  useEffect(() => {
    localStorage.setItem('questProgress', JSON.stringify({ balance, completedQuests }));
  }, [balance, completedQuests]);

  const level = Math.floor(balance / LEVEL_STEP);
  const progress = (balance % LEVEL_STEP) / LEVEL_STEP;

  const completeQuest = quest => {
    if (completedQuests.includes(quest.id)) return;
    setCompletedQuests(prev => [...prev, quest.id]);
    setBalance(prev => prev + quest.reward);
  };

  return (
    <QuestContext.Provider value={{ balance, level, progress, completeQuest, completedQuests }}>
      {children}
    </QuestContext.Provider>
  );
};
