// src/types/quest.types.ts

// ========== ОСНОВНЫЕ ТИПЫ ==========

// Вариант ответа для choice-шага
export type ChoiceOption = {
  text: string;
  correct?: boolean; // правильный ли ответ
  effect?: string; // эффект (для квеста про вложения)
  result?: string; // пояснение результата
};

// Типы шагов (discriminated union)
export type InfoStep = {
  type: 'info' | 'highlight' | 'timer' | 'complete';
  text: string;
  target?: string;
};

export type ChoiceStep = {
  type: 'choice';
  question: string;
  options: ChoiceOption[];
};

export type CalculationStep = {
  type: 'calculation';
  question: string;
  correctAnswer: number;
};

export type ActionStep = {
  type: 'action';
  action: string;
  text: string;
  requiredTotal?: number;
};

export type StatsStep = {
  type: 'stats';
  text: string;
};

// Объединённый тип для шага квеста
export type QuestStep = InfoStep | ChoiceStep | CalculationStep | ActionStep | StatsStep;

// Полный квест
export type Quest = {
  id: number;
  title: string;
  description: string;
  reward: number;
  planetId: number;
  x: string;
  y: string;
  type: string;
  status?: 'locked' | 'available' | 'completed';
  steps: QuestStep[];
};

// ========== ФИНАНСОВЫЕ ТИПЫ ==========

// Четыре конверта с деньгами
export type Covers = {
  needs: number; // необходимости
  wants: number; // хотелки
  savings: number; // накопления
  good: number; // добрые дела
};

// Цель накоплений
export type Goal = {
  title: string;
  targetAmount: number;
};

// ========== ПРОГРЕСС ПОЛЬЗОВАТЕЛЯ ==========

// Прогресс одного квеста
export type QuestProgress = {
  questId: number;
  step: number;
  completed: boolean;
};

// Полный прогресс пользователя
export type UserProgress = {
  balance: number;
  budget: number;
  covers: Covers;
  completedQuests: number[];
  goal: Goal | null;
  currentQuestId: number | null;
  questProgressMap: Record<number, number>;
  actionState: Record<string, boolean>;
  activeHighlight: { target: string; text: string } | null;
};

// ========== ФЛАГИ КВЕСТОВ ==========

export type QuestFlags = {
  isChecking: boolean;
  startCheck: () => void;
  stopCheck: () => void;
};

// ========== ВАЛИДАЦИЯ РАСПРЕДЕЛЕНИЯ ==========

// Результат проверки
export type ValidationResult = {
  isValid: boolean;
  message: string;
};

// Идеальное распределение для суммы
export type IdealDistribution = {
  needs: number;
  wants: number;
  savings: number;
  good: number;
  tolerance: number;
  total: number;
};

// Правила распределения (50-20-20-10)
export type BudgetRules = {
  PERCENTAGES: {
    needs: number;
    wants: number;
    savings: number;
    good: number;
  };
  TOLERANCE: number;
};

// ========== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ ==========
export type BaseStep = {
  type: string;
  text?: string;
};

// Тип для location.state при навигации
export type LocationState = {
  fromQuest?: boolean;
};

// Тип для пропсов step в StepRenderer
export type StepRendererProps = {
  step: QuestStep;
  next: () => void;
  stepIndex: number;
};

// Тип для контекста (используется в QuestContext)
export type QuestContextValue = {
  // Финансы
  balance: number;
  budget: number;
  covers: Covers;
  level: number;
  progress: number;
  canDistribute: boolean;
  setBudget: (value: number) => void;
  distributeBudget: (allocation: Covers) => void;
  createGoal: (goal: Goal) => void;
  clearGoal: () => void;

  // Цель
  goal: Goal | null;

  // Прогресс квестов
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
  setActionState: (
    state: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)
  ) => void;
  saveQuestProgress: (questId: number, step: number) => void;

  // Подсветка
  startHighlight: (target: string, text: string) => void;
  stopHighlight: () => void;

  // Валидация
  validateBudget: (covers: Covers, totalAmount: number) => ValidationResult;
  getIdealDistribution: (totalAmount: number) => IdealDistribution;
  hasSavings: (covers: Covers) => boolean;
  getSavingsPercent: (covers: Covers) => number;
  budgetRules: BudgetRules;

  // Флаги
  isCheckingDistribution: boolean;
  startDistributionCheck: () => void;
  stopDistributionCheck: () => void;
};
