export const LEVEL_STEP = 5;

//правила распределения фини для квестов
export const BUDGET_RULES = {
  PERCENTAGES: {
    needs: 50,
    wants: 20,
    savings: 20,
    good: 10,
  },
  TOLERANCE: 5,
};

//функция для значений распределения
export const getIdealDistribution = totalAmount => {
  const { PERCENTAGES, TOLERANCE } = BUDGET_RULES;
  return {
    needs: Math.round((totalAmount * PERCENTAGES.needs) / 100),
    wants: Math.round((totalAmount * PERCENTAGES.wants) / 100),
    savings: Math.round((totalAmount * PERCENTAGES.savings) / 100),
    good: Math.round((totalAmount * PERCENTAGES.good) / 100),
    tolerance: Math.round((totalAmount * TOLERANCE) / 100),
    total: totalAmount,
  };
};

//функция для проверки распределения
export const validateDistribution = (covers, totalAmount) => {
  const ideal = getIdealDistribution(totalAmount);
  const { needs, wants, savings, good } = covers;
  const actualTotal = needs + wants + savings + good;

  if (actualTotal !== totalAmount) {
    return {
      isValid: false,
      message: `❌ Нужно распределить ровно ${totalAmount} Фини. У тебя получилось ${actualTotal}.`,
    };
  }

  const needsDiff = Math.abs(needs - ideal.needs);
  const wantsDiff = Math.abs(wants - ideal.wants);
  const savingsDiff = Math.abs(savings - ideal.savings);
  const goodDiff = Math.abs(good - ideal.good);

  const isValid =
    needsDiff <= ideal.tolerance &&
    wantsDiff <= ideal.tolerance &&
    savingsDiff <= ideal.tolerance &&
    goodDiff <= ideal.tolerance;

  const getSmile = (diff, tolerance) => (diff <= tolerance ? '✅' : '❌');

  return {
    isValid,
    message: isValid
      ? `✅ Отлично! Ты точно попал в пропорции 50-20-20-10!`
      : `❌ Давай попробуем еще раз!
         
📊 Идеальные пропорции (50-20-20-10) для ${totalAmount} Фини:
• Необходимости: ${ideal.needs} 🟢
• Накопления: ${ideal.savings} 🔵
• Хотелки: ${ideal.wants} 🟣
• Добрые дела: ${ideal.good} 💝

📊 У тебя получилось:
• Необходимости: ${needs} ${getSmile(needsDiff, ideal.tolerance)}
• Накопления: ${savings} ${getSmile(savingsDiff, ideal.tolerance)}
• Хотелки: ${wants} ${getSmile(wantsDiff, ideal.tolerance)}
• Добрые дела: ${good} ${getSmile(goodDiff, ideal.tolerance)}

💡 Допускается отклонение до ${ideal.tolerance} Фини в каждую сторону`,
  };
};

export const STEP_TYPE = {
  INFO: 'info',
  HIGHLIGHT: 'highlight',
  CHOICE: 'choice',
  CALCULATION: 'calculation',
  ACTION: 'action',
  STATS: 'stats',
  COMPLETE: 'complete',
};

export const ACTION_TYPES = {
  DISTRIBUTE_MONEY: 'distributeMoney',
  CREATE_GOAL: 'createGoal',
};

export const HIGHLIGHT_TARGETS = {
  BALANCE: 'balance',
  MENU_QUESTS: 'menu_quests',
  MENU_BUDGET: 'menu_budget',
  TARGET: 'target',
  COVER_NEEDS: 'cover_needs',
  COVER_WANTS: 'cover_wants',
  COVER_SAVINGS: 'cover_savings',
  COVER_GOOD: 'cover_good',
};

export const QUEST_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  COMPLETED: 'completed',
};

export const QUEST_TYPE = {
  LEARN: 'learn',
  PLAY: 'play',
  THINK: 'think',
  PLAN: 'plan',
};

export const TARGET_STATES = {
  NO_TARGET: 'NO_TARGET',
  EMPTY: 'EMPTY',
  STARTED: 'STARTED',
  PROGRESS: 'PROGRESS',
  ALMOST: 'ALMOST',
  DONE: 'DONE',
};

export const TARGET_THRESHOLDS = {
  STARTED: 0.3,
  PROGRESS: 0.7,
  DONE: 1,
};
