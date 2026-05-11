import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ACTION_TYPES, LEVEL_STEP, STEP_TYPE } from '../constants/gameConstants';
import { quests } from '../data/quests';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useQuestFlags } from '../hooks/useQuestFlags';
import { useQuestValidation } from '../hooks/useQuestValidation';
import { loadProgress as loadProgressAPI, saveProgress as saveProgressAPI } from '../services/api';
import {
  BudgetRules,
  Covers,
  Goal,
  IdealDistribution,
  Quest,
  ValidationResult,
} from '../types/quest.types';
import { loadProgress } from '../utils/storage';

export type QuestContextValue = {
  balance: number;
  budget: number;
  covers: Covers;
  level: number;
  progress: number;
  canDistribute: boolean;
  isLoading: boolean;
  setBudget: (value: number) => void;
  distributeBudget: (allocation: Covers) => void;
  createGoal: (goal: Goal) => void;
  clearGoal: () => void;
  goal: Goal | null;
  questStep: number;
  actionState: Record<string, boolean>;
  completedQuests: number[];
  currentQuest: Quest | null;
  nextQuest: Quest | null;
  questProgressMap: Record<number, number>;
  currentQuestId: number | null;
  activeHighlight: { target: string; text: string } | null;
  completeQuest: (questId: number) => void;
  setCurrentQuestId: (id: number | null) => void;
  setQuestStep: (step: number) => void;
  setActionState: Dispatch<SetStateAction<Record<string, boolean>>>;
  saveQuestProgress: (questId: number, step: number) => void;
  startHighlight: (target: string, text: string) => void;
  stopHighlight: () => void;
  validateBudget: (covers: Covers, totalAmount: number) => ValidationResult;
  getIdealDistribution: (totalAmount: number) => IdealDistribution;
  hasSavings: (covers: Covers) => boolean;
  getSavingsPercent: (covers: Covers) => number;
  budgetRules: BudgetRules;
  isCheckingDistribution: boolean;
  startDistributionCheck: () => void;
  stopDistributionCheck: () => void;
};

export const QuestContext = createContext<QuestContextValue | undefined>(undefined);

export const QuestProvider = ({ children }: { children: React.ReactNode }) => {
  const saved = loadProgress();

  // ========== СОСТОЯНИЯ ==========
  const [balance, setBalance] = useLocalStorage('balance', 0);
  const [budget, setBudget] = useLocalStorage('budget', 0);
  const [covers, setCovers] = useLocalStorage('covers', {
    needs: 0,
    wants: 0,
    savings: 0,
    good: 0,
  });
  const [completedQuests, setCompletedQuests] = useLocalStorage('completedQuests', []);
  const [currentQuestId, setCurrentQuestId] = useLocalStorage('currentQuestId', null);
  const [questProgressMap, setQuestProgressMap] = useLocalStorage('questProgressMap', {});
  const [actionState, setActionState] = useLocalStorage('actionState', {});
  const [goal, setGoal] = useLocalStorage('goal', null);
  const [activeHighlight, setActiveHighlight] = useLocalStorage('activeHighlight', null);

  // ========== ИДЕНТИФИКАТОР ПОЛЬЗОВАТЕЛЯ ==========
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('userId');
    return saved ? parseInt(saved, 10) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ========== ЗАГРУЗКА ПРОГРЕССА С СЕРВЕРА ==========
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        console.log('Загрузка прогресса для userId:', userId);
        const progress = await loadProgressAPI(userId);
        console.log('Получен прогресс:', progress);

        setBalance(progress.balance);
        setBudget(progress.budget);
        setCovers(progress.covers);
        setCompletedQuests(progress.completed_quests);
        setCurrentQuestId(progress.current_quest_id);
        setGoal(progress.goal);
      } catch (err) {
        console.error('Ошибка загрузки прогресса:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserProgress();
  }, [userId]);

  // ========== СОХРАНЕНИЕ ПРОГРЕССА НА СЕРВЕРЕ ==========
  useEffect(() => {
    const saveUserProgress = async () => {
      if (!userId || isLoading) return;
      try {
        await saveProgressAPI(userId, {
          balance,
          budget,
          covers,
          completedQuests,
          currentQuestId,
          goal,
        });
        console.log('Прогресс сохранен на сервере');
      } catch (err) {
        console.error('Ошибка сохранения прогресса:', err);
      }
    };
    const timer = setTimeout(() => {
      saveUserProgress();
    }, 1000);
    return () => clearTimeout(timer);
  }, [balance, budget, covers, completedQuests, currentQuestId, userId, isLoading]);

  // ========== ОСОБОЕ СОСТОЯНИЕ ==========
  const [questStep, setQuestStep] = useState<number>(
    saved.currentQuestId && saved.questProgressMap?.[saved.currentQuestId]
      ? saved.questProgressMap[saved.currentQuestId]
      : 0
  );

  // Синхронизация
  useEffect(() => {
    if (currentQuestId && questProgressMap[currentQuestId] !== questStep) {
      setQuestProgressMap(prev => ({ ...prev, [currentQuestId]: questStep }));
    }
  }, [currentQuestId, questStep, setQuestProgressMap, questProgressMap]);

  // ========== ХУКИ ЛОГИКИ ==========
  const questValidation = useQuestValidation();
  const questFlags = useQuestFlags();

  // ========== ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ==========
  const level = Math.floor(balance / LEVEL_STEP);
  const progress = (balance % LEVEL_STEP) / LEVEL_STEP;
  const currentQuest = (quests.find(q => q.id === currentQuestId) as Quest) ?? null;
  const nextQuest = (quests.find(q => !completedQuests.includes(q.id)) as Quest) ?? null;
  const canDistribute = budget > 0;

  // ========== ФУНКЦИИ КВЕСТОВ ==========
  const saveQuestProgress = (questId: number, stepNumber: number): void => {
    setQuestProgressMap(prev => ({ ...prev, [questId]: stepNumber }));
    if (questId === currentQuestId) setQuestStep(stepNumber);
  };

  const handleSetQuestStep = (newStep: number): void => {
    setQuestStep(newStep);
    if (currentQuestId) {
      setQuestProgressMap(prev => ({ ...prev, [currentQuestId]: newStep }));
    }
  };

  const completeQuest = (questId: number): void => {
    if (completedQuests.includes(questId)) return;
    const quest = quests.find(q => q.id === questId) as Quest | undefined;
    if (!quest) return;

    setCompletedQuests(prev => [...prev, questId]);
    setBalance(prev => prev + quest.reward);
    setBudget(prev => prev + quest.reward);

    setQuestProgressMap(prev => {
      const newMap = { ...prev };
      delete newMap[questId];
      return newMap;
    });

    setCurrentQuestId(null);
    setQuestStep(0);
    setActionState({});
  };

  // ========== ПОДСВЕТКА ==========
  const startHighlight = (target: string, text: string): void => {
    setActiveHighlight({ target, text });
  };

  const stopHighlight = (): void => {
    setActiveHighlight(null);
  };

  // ========== ФИНАНСЫ ==========
  const distributeBudget = (allocation: Covers): void => {
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (total === 0 || total > budget) return;

    setCovers(prev => ({
      needs: prev.needs + allocation.needs,
      wants: prev.wants + allocation.wants,
      savings: prev.savings + allocation.savings,
      good: prev.good + allocation.good,
    }));
    setBudget(0);

    if (currentQuestId && currentQuest) {
      const currentStep = currentQuest.steps[questStep];
      if (currentStep?.type === STEP_TYPE.ACTION && 'action' in currentStep) {
        setActionState(prev => ({ ...prev, [currentStep.action!]: true }));
      }
    }
  };

  const createGoal = (newGoal: Goal): void => {
    if (goal) {
      setCovers(prev => ({
        ...prev,
        savings: Math.max(0, prev.savings - goal.targetAmount),
      }));
    }
    setGoal(newGoal);

    if (currentQuestId && currentQuest) {
      const hasCreateGoalAction = currentQuest.steps.some(
        step =>
          step.type === STEP_TYPE.ACTION &&
          'action' in step &&
          step.action === ACTION_TYPES.CREATE_GOAL
      );
      if (hasCreateGoalAction) {
        setActionState(prev => ({ ...prev, [ACTION_TYPES.CREATE_GOAL]: true }));
      }
    }
  };

  const clearGoal = (): void => {
    setGoal(null);
  };

  // ========== PROVIDER ==========
  return (
    <QuestContext.Provider
      value={{
        balance,
        budget,
        covers,
        level,
        progress,
        canDistribute,
        isLoading,
        setBudget,
        distributeBudget,
        createGoal,
        clearGoal,
        goal,
        questStep,
        actionState,
        completedQuests,
        currentQuest,
        nextQuest,
        questProgressMap,
        currentQuestId,
        activeHighlight,
        completeQuest,
        setCurrentQuestId,
        setQuestStep: handleSetQuestStep,
        setActionState,
        saveQuestProgress,
        startHighlight,
        stopHighlight,
        validateBudget: questValidation.validate,
        getIdealDistribution: questValidation.getIdeal,
        hasSavings: questValidation.hasSavings,
        getSavingsPercent: questValidation.getSavingsPercent,
        budgetRules: questValidation.rules,
        isCheckingDistribution: questFlags.isChecking,
        startDistributionCheck: questFlags.startCheck,
        stopDistributionCheck: questFlags.stopCheck,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
