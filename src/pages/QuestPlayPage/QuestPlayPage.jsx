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
  const steps = currentQuest?.steps || [];
  const step = steps[questStep];

  // Редирект если нет квеста
  useEffect(() => {
    if (!currentQuest) {
      navigate('/quests');
    }
  }, [currentQuest, navigate]);

  // Устанавливаем бюджет для distributeMoney
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action' || step.action !== 'distributeMoney') return;
    if (actionState.distributeMoney) return;
    if (budget < step.requiredTotal) {
      setBudget(step.requiredTotal);
    }
  }, [step, actionState.distributeMoney, budget, setBudget]);

  // Обрабатываем завершение action
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;

    const isDone = actionState[step.action];
    if (!isDone) return;

    console.log('✅ Action completed:', step.action, 'Step:', questStep);

    // Переходим на следующий шаг
    if (questStep < steps.length - 1) {
      saveQuestProgress(currentQuestId, questStep + 1);
      setQuestStep(questStep + 1);
    }

    // Сбрасываем только выполненное действие
    setActionState(prev => {
      const newState = { ...prev };
      delete newState[step.action];
      return newState;
    });
  }, [actionState, step, questStep, steps.length, currentQuestId, saveQuestProgress, setQuestStep]);

  // Если нет шага - завершаем квест
  if (!currentQuest) return null;
  if (!step) {
    completeQuest(currentQuest.id);
    return null;
  }

  const next = () => {
    if (questStep < steps.length - 1) {
      saveQuestProgress(currentQuest.id, questStep + 1);
      setQuestStep(questStep + 1);
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
