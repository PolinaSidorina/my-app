import { createContext, useEffect, useState } from 'react';
import { quests } from '../data/quests';

export const QuestContext = createContext();

const LEVEL_STEP = 100;

/**
 * Провайдер контекста квестов
 * Управляет:
 * - финансами (balance, budget, covers)
 * - прогрессом квестов (questProgressMap, questStep)
 * - состояниями действий (actionState)
 * - целями пользователя (goal)
 */
export const QuestProvider = ({ children }) => {
  // ============================================
  // 1. ЗАГРУЗКА СОХРАНЕННОГО ПРОГРЕССА ИЗ LOCALSTORAGE
  // ============================================
  const saved = JSON.parse(localStorage.getItem('questProgress') || '{}');

  // ============================================
  // 2. СОСТОЯНИЯ ПРИЛОЖЕНИЯ
  // ============================================

  // --- Финансовые состояния ---
  const [balance, setBalance] = useState(saved.balance ?? 0); // Общий баланс
  const [budget, setBudget] = useState(saved.budget ?? 0); // Текущий бюджет для распределения
  const [covers, setCovers] = useState(
    // Четыре конверта
    saved.covers ?? {
      needs: 0, // Необходимости
      wants: 0, // Хотелки
      savings: 0, // Накопления
      good: 0, // Добрые дела
    }
  );

  // --- Прогресс квестов ---
  const [completedQuests, setCompletedQuests] = useState(saved.completedQuests ?? []); // Завершенные квесты
  const [currentQuestId, setCurrentQuestId] = useState(saved.currentQuestId ?? null); // Текущий квест
  const [questProgressMap, setQuestProgressMap] = useState(saved.questProgressMap ?? {}); // Прогресс всех квестов {questId: step}

  // Текущий шаг: берем из прогресс-мапы или 0
  const [questStep, setQuestStep] = useState(
    saved.currentQuestId && saved.questProgressMap?.[saved.currentQuestId]
      ? saved.questProgressMap[saved.currentQuestId]
      : 0
  );

  // --- Состояние действий ---
  // Хранит выполненные действия в рамках текущего квеста
  // Например: { distributeMoney: true, createGoal: true }
  const [actionState, setActionState] = useState(saved.actionState ?? {});

  // --- Цель пользователя ---
  const [goal, setGoal] = useState(saved.goal ?? null);

  // --- Состояние подсветки ---
  const [activeHighlight, setActiveHighlight] = useState(saved.activeHighlight ?? null);
  // ============================================
  // 3. СОХРАНЕНИЕ В LOCALSTORAGE
  // ============================================
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
      activeHighlight,
    };
    localStorage.setItem('questProgress', JSON.stringify(progress));
  }, [
    balance,
    budget,
    completedQuests,
    covers,
    goal,
    currentQuestId,
    questProgressMap,
    actionState,
    activeHighlight,
  ]);

  // ============================================
  // 4. ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
  // ============================================

  // Уровень и прогресс до следующего уровня (на основе balance)
  const level = Math.floor(balance / LEVEL_STEP);
  const progress = (balance % LEVEL_STEP) / LEVEL_STEP;

  // Текущий квест из массива всех квестов
  const currentQuest = quests.find(q => q.id === currentQuestId) ?? null;

  // Следующий доступный квест (первый незавершенный)
  const nextQuest = quests.find(q => !completedQuests.includes(q.id)) ?? null;

  // Может ли пользователь распределять бюджет
  const canDistribute = budget > 0;

  // ============================================
  // 5. ФУНКЦИИ ДЛЯ РАБОТЫ С КВЕСТАМИ
  // ============================================

  /**
   * Сохраняет прогресс конкретного квеста
   * @param {number} questId - ID квеста
   * @param {number} step - номер шага
   */
  const saveQuestProgress = (questId, step) => {
    setQuestProgressMap(prev => ({
      ...prev,
      [questId]: step,
    }));

    // Если это текущий квест - обновляем и questStep
    if (questId === currentQuestId) {
      setQuestStep(step);
    }
  };

  /**
   * Устанавливает текущий шаг квеста
   * @param {number} newStep - новый номер шага
   */
  const handleSetQuestStep = newStep => {
    setQuestStep(newStep);

    // Сохраняем прогресс для текущего квеста
    if (currentQuestId) {
      setQuestProgressMap(prev => ({
        ...prev,
        [currentQuestId]: newStep,
      }));
    }
  };

  /**
   * Начинает квест
   * @param {number} id - ID квеста
   */
  const startQuest = id => {
    setCurrentQuestId(id);
    // Восстанавливаем прогресс, если он был
    const savedStep = questProgressMap[id] ?? 0;
    setQuestStep(savedStep);
    setActionState({});
  };

  /**
   * Завершает квест и начисляет награду
   * @param {number} questId - ID квеста
   */
  const completeQuest = questId => {
    // Защита от повторного завершения
    if (completedQuests.includes(questId)) return;

    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    // Добавляем в список завершенных
    setCompletedQuests(prev => [...prev, questId]);

    // Начисляем награду
    setBalance(prev => prev + quest.reward);
    setBudget(prev => prev + quest.reward);

    // Удаляем прогресс квеста
    setQuestProgressMap(prev => {
      const newMap = { ...prev };
      delete newMap[questId];
      return newMap;
    });

    // Сбрасываем состояние
    setCurrentQuestId(null);
    setQuestStep(0);
    setActionState({});
  };

  //Функции ихменения подсветки
  const startHighlight = (target, text) => setActiveHighlight({ target, text });
  const stopHighlight = () => setActiveHighlight(null);

  // ============================================
  // 6. ФУНКЦИИ ДЛЯ РАБОТЫ С ФИНАНСАМИ
  // ============================================

  /**
   * Распределяет бюджет по конвертам
   * @param {Object} allocation - распределение {needs, wants, savings, good}
   */
  const distributeBudget = allocation => {
    const total = Object.values(allocation).reduce((a, b) => a + b, 0);

    // Валидация
    if (total === 0 || total > budget) return;

    // Добавляем суммы к конвертам
    setCovers(prev => ({
      needs: prev.needs + allocation.needs,
      wants: prev.wants + allocation.wants,
      savings: prev.savings + allocation.savings,
      good: prev.good + allocation.good,
    }));

    // Обнуляем бюджет
    setBudget(0);

    // Если есть активный квест с действием distributeMoney - отмечаем выполнение
    // 🟢 ИСПРАВЛЕНО: Проверяем, какое действие active в текущем квесте
    if (currentQuestId && currentQuest) {
      // Находим текущий шаг action
      const currentStep = currentQuest.steps[questStep];

      if (currentStep?.type === 'action') {
        // Отмечаем именно то действие, которое сейчас выполняется
        setActionState(prev => ({
          ...prev,
          [currentStep.action]: true, // distributeMoney ИЛИ monthlyPlanning
        }));
      }
    }
  };

  /**
   * Создает новую цель для накоплений
   * @param {Object} newGoal - {title, targetAmount}
   */
  const createGoal = newGoal => {
    // Если была старая цель - списываем потраченное
    if (goal) {
      setCovers(prev => ({
        ...prev,
        savings: Math.max(0, prev.savings - goal.targetAmount),
      }));
    }
    setGoal(newGoal);

    if (currentQuestId && currentQuest) {
      const hasCreateGoalAction = currentQuest.steps.some(
        step => step.type === 'action' && step.action === 'createGoal'
      );
      if (hasCreateGoalAction) {
        setActionState(prev => ({
          ...prev,
          createGoal: true,
        }));
      }
    }
  };

  /** Сбрасывает цель */
  const clearGoal = () => setGoal(null);

  // ============================================
  // 7. PROVIDER
  // ============================================
  return (
    <QuestContext.Provider
      value={{
        // --- Финансы ---
        balance,
        budget,
        covers,
        level,
        progress,
        canDistribute,

        // --- Цель ---
        goal,

        // --- Прогресс квестов ---
        questStep,
        actionState,
        completedQuests,
        currentQuest,
        nextQuest,
        questProgressMap,
        currentQuestId,
        activeHighlight,

        // --- Функции для квестов ---
        completeQuest,
        setCurrentQuestId,
        setQuestStep: handleSetQuestStep,
        setActionState,
        saveQuestProgress,
        startHighlight,
        stopHighlight,

        // --- Функции для финансов ---
        distributeBudget,
        setBudget,
        createGoal,
        clearGoal,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};
