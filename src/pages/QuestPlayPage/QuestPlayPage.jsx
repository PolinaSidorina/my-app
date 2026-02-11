import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepRenderer from '../../components/QuestsSteps/StepRenderer';
import { QuestContext } from '../../context/QuestContext';

const QuestPlayPage = function () {
  const {
    currentQuest,
    questStep,
    setQuestStep,
    completeQuest,
    actionState,
    setBudget,
    budget,
    setActionState,
    saveQuestProgress,
    currentQuestId,
  } = useContext(QuestContext);

  const navigate = useNavigate();

  // вычисляем безопасно
  const steps = currentQuest?.steps || [];
  const step = steps[questStep];

  // 🔹 редирект если квеста нет
  useEffect(() => {
    if (!currentQuest) {
      navigate('/quests');
    }
  }, [currentQuest, navigate]);

  // 🔹 добавляем фини при distributeMoney
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;
    if (step.action !== 'distributeMoney') return;
    // if (step.type === 'action' && step.action === 'distributeMoney') {
    if (actionState.distributeMoney) return;
    const required = step.requiredTotal;

    if (budget < required) {
      setBudget(required);
    }
    // }
  }, [step, actionState, budget, setBudget]);

  // 🔹 проверяем выполнение action
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;

    const isDone = actionState[step.action];
    if (!isDone) return;
    if (currentQuestId) {
      saveQuestProgress(currentQuestId, questStep + 1);
    }
    setQuestStep(prev => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      return prev;
    });

    // Сбрасываем actionState только для текущего действия
    setActionState(prev => {
      const newState = { ...prev };
      delete newState[step.action];
      return newState;
    });
  }, [actionState, step, steps.length]);

  // теперь можно return
  if (!currentQuest) return null;
  if (!step) {
    completeQuest(currentQuest.id);
    return null;
  }

  const next = () => {
    if (questStep < steps.length - 1) {
      saveQuestProgress(currentQuest.id, questStep + 1);
      setQuestStep(prev => prev + 1);
    } else {
      completeQuest(currentQuest.id);
    }
  };

  return (
    <div>
      <div>{currentQuest.title}</div>
      <StepRenderer step={step} next={next} />
    </div>
  );
};

export default QuestPlayPage;
