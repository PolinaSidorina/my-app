import { createContext, useEffect, useState } from 'react';
import { quests } from '../data/quests';

export const QuestContext = createContext();

const LEVEL_STEP = 100;
const BUDGET_STEP = 5;

export const QuestProvider = ({ children }) => {
  // 1. Загружаем сохранённый прогресс
  const saved = JSON.parse(localStorage.getItem('questProgress') || '{}');

  // 2. Основные состояния
  const safeBalance =
    typeof saved.balance === 'number' && !Number.isNaN(saved.balance) ? saved.balance : 0;
  const safeBudget =
    typeof saved.budget === 'number' && !Number.isNaN(saved.budget) ? saved.budget : 0;

  const [balance, setBalance] = useState(safeBalance);
  const [budget, setBudget] = useState(safeBudget);
  const [completedQuests, setCompletedQuests] = useState(saved.completedQuests ?? []);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  const safeGoal = saved.goal ?? null;
  const [goal, setGoal] = useState(safeGoal);
  const safeCovers = saved.covers ?? {
    needs: 0,
    wants: 0,
    savings: 0,
    good: 0,
  };
  const [covers, setCovers] = useState(safeCovers);
  const canDistribute = budget > 0;

  const [questStep, setQuestStep] = useState(0);
  // 3. Сохраняем прогресс
  useEffect(() => {
    localStorage.setItem(
      'questProgress',
      JSON.stringify({
        balance,
        budget,
        completedQuests,
        covers,
        goal,
      })
    );
  }, [balance, budget, completedQuests, covers, goal]);

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
    setBudget(prev => {
      const safePrev = Number.isFinite(prev) ? prev : 0;
      return safePrev + quest.reward;
    });
    setCurrentQuestId(null);
    setQuestStep(0);
  };
  // 8. Очистка бюджета
  const clearBudget = () => {
    setBudget(0);
  };

  const distributeBudget = allocation => {
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (total === 0) return;
    if (total > budget) return;
    setCovers(prev => ({
      needs: prev.needs + allocation.needs,
      wants: prev.wants + allocation.wants,
      savings: prev.savings + allocation.savings,
      good: prev.good + allocation.good,
    }));
    setBudget(0);
  };

  const createGoal = newGoal => {
    setCovers(prev => {
      if (!goal) return prev;
      const spent = goal.targetAmount;
      const rest = Math.max(0, prev.savings - spent);
      return {
        ...prev,
        savings: rest,
      };
    });
    setGoal(newGoal);
  };

  const clearGoal = () => {
    setGoal(null);
  };

  return (
    <QuestContext.Provider
      value={{
        balance,
        budget,
        covers,
        level,
        progress,
        goal,
        questStep,

        completedQuests,

        currentQuest,
        nextQuest,

        completeQuest,
        distributeBudget,
        setCurrentQuestId,
        setBudget,
        canDistribute,
        createGoal,
        clearGoal,
        setQuestStep,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
