import { createContext, useEffect, useState } from 'react';
import { quests } from '../data/quests';

export const QuestContext = createContext();

const LEVEL_STEP = 100;

export const QuestProvider = ({ children }) => {
  // 1. Загружаем сохранённый прогресс
  const saved = JSON.parse(localStorage.getItem('questProgress') || '{}');

  // 2. Основные состояния
  const [balance, setBalance] = useState(saved.balance ?? 0);
  const [budget, setBudget] = useState(saved.budget ?? 0);
  const [completedQuests, setCompletedQuests] = useState(saved.completedQuests ?? []);
  const [currentQuestId, setCurrentQuestId] = useState(saved.currentQuestId ?? null);
  const [goal, setGoal] = useState(saved.goal ?? null);
  const [covers, setCovers] = useState(
    saved.covers ?? {
      needs: 0,
      wants: 0,
      savings: 0,
      good: 0,
    }
  );

  // 🔥 КЛЮЧЕВОЕ: Инициализируем из saved
  const [questProgressMap, setQuestProgressMap] = useState(saved.questProgressMap ?? {});
  const [questStep, setQuestStep] = useState(
    saved.currentQuestId && saved.questProgressMap?.[saved.currentQuestId]
      ? saved.questProgressMap[saved.currentQuestId]
      : 0
  );
  const [actionState, setActionState] = useState(saved.actionState ?? {});

  // 3. Сохраняем прогресс - ВАЖНО: все состояния сразу
  useEffect(() => {
    const progress = {
      balance,
      budget,
      completedQuests,
      covers,
      goal,
      currentQuestId,
      questProgressMap,
      actionState,
    };
    localStorage.setItem('questProgress', JSON.stringify(progress));
    console.log('💾 Saved progress:', progress);
  }, [
    balance,
    budget,
    completedQuests,
    covers,
    goal,
    currentQuestId,
    questProgressMap,
    actionState,
  ]);

  // 4. Уровень и прогресс
  const level = Math.floor(balance / LEVEL_STEP);
  const progress = (balance % LEVEL_STEP) / LEVEL_STEP;

  // 5. Активный квест
  const currentQuest = quests.find(q => q.id === currentQuestId) ?? null;
  const nextQuest = quests.find(q => !completedQuests.includes(q.id)) ?? null;

  // 🔥 Сохраняем прогресс квеста
  const saveQuestProgress = (questId, step) => {
    console.log('💾 Saving quest progress:', questId, step);
    setQuestProgressMap(prev => {
      const newMap = { ...prev, [questId]: step };
      return newMap;
    });
    if (questId === currentQuestId) {
      setQuestStep(step);
    }
  };

  // 🔥 Устанавливаем шаг
  const handleSetQuestStep = newStep => {
    setQuestStep(newStep);
    if (currentQuestId) {
      setQuestProgressMap(prev => ({
        ...prev,
        [currentQuestId]: newStep,
      }));
    }
  };

  // 7. Завершение квеста
  const completeQuest = questId => {
    if (completedQuests.includes(questId)) return;
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    setCompletedQuests(prev => [...prev, questId]);
    setBalance(prev => prev + quest.reward);
    setBudget(prev => prev + quest.reward);

    // Удаляем прогресс квеста
    setQuestProgressMap(prev => {
      const newMap = { ...prev };
      delete newMap[questId];
      return newMap;
    });

    setCurrentQuestId(null);
    setQuestStep(0);
    setActionState({});
  };

  // 8. Распределение бюджета
  const distributeBudget = allocation => {
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (total === 0 || total > budget) return;

    setCovers(prev => ({
      needs: prev.needs + allocation.needs,
      wants: prev.wants + allocation.wants,
      savings: prev.savings + allocation.savings,
      good: prev.good + allocation.good,
    }));

    setBudget(0);

    if (currentQuestId) {
      setActionState(prev => ({
        ...prev,
        distributeMoney: true,
      }));
    }
  };

  const createGoal = newGoal => {
    if (goal) {
      setCovers(prev => ({
        ...prev,
        savings: Math.max(0, prev.savings - goal.targetAmount),
      }));
    }
    setGoal(newGoal);
  };

  const clearGoal = () => setGoal(null);

  const startQuest = id => {
    setCurrentQuestId(id);
    const savedStep = questProgressMap[id] ?? 0;
    setQuestStep(savedStep);
    setActionState({});
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
        actionState,
        completedQuests,
        currentQuest,
        nextQuest,
        completeQuest,
        distributeBudget,
        setCurrentQuestId,
        setBudget,
        canDistribute: budget > 0,
        createGoal,
        clearGoal,
        setQuestStep: handleSetQuestStep,
        setActionState,
        questProgressMap,
        saveQuestProgress,
        currentQuestId,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
