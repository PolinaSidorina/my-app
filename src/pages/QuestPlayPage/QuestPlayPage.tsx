// src/pages/QuestPlayPage/QuestPlayPage.tsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepRenderer from '../../components/QuestsSteps/StepRenderer';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import Mascot from '../../img/mascot.svg';
import { ActionStep, BaseStep } from '../../types/quest.types';
import styles from './QuestPlayPage.module.css';

const QuestPlayPage = () => {
  const context = useContext(QuestContext) as QuestContextValue;
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
    startHighlight,
    stopHighlight,
  } = context;

  const navigate = useNavigate();

  // Вычисляем текущий шаг
  const steps = currentQuest?.steps || [];
  const step = steps[questStep] as BaseStep | undefined;

  // Редирект, если нет активного квеста
  useEffect(() => {
    if (!currentQuest) {
      navigate('/quests');
    }
  }, [currentQuest, navigate]);

  // Эффект для обработки highlight
  useEffect(() => {
    if (!step) return;

    if (step.type === 'highlight') {
      startHighlight((step as any).target, (step as any).text);

      switch ((step as any).target) {
        case HIGHLIGHT_TARGETS.BALANCE:
        case HIGHLIGHT_TARGETS.MENU_QUESTS:
        case HIGHLIGHT_TARGETS.MENU_BUDGET:
        case HIGHLIGHT_TARGETS.TARGET:
          navigate('/home');
          break;
        case HIGHLIGHT_TARGETS.COVER_NEEDS:
        case HIGHLIGHT_TARGETS.COVER_WANTS:
        case HIGHLIGHT_TARGETS.COVER_SAVINGS:
        case HIGHLIGHT_TARGETS.COVER_GOOD:
          navigate('/budget');
          break;
        default:
          break;
      }
    } else {
      stopHighlight();
    }
  }, [step, startHighlight, stopHighlight, navigate]);

  // Эффект для установки бюджета (только для action)
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;

    const actionStep = step as ActionStep;
    if (actionStep.action !== 'distributeMoney' && actionStep.action !== 'monthlyPlanning') return;

    if (actionState[actionStep.action]) return;
    if (budget < (actionStep.requiredTotal || 0)) {
      setBudget(actionStep.requiredTotal || 0);
    }
  }, [step, actionState, budget, setBudget]);

  // Эффект для завершения действия
  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;

    const actionStep = step as ActionStep;
    const isDone = actionState[actionStep.action];
    if (!isDone) return;

    // Переходим на следующий шаг (если не последний)
    if (questStep < steps.length - 1 && currentQuestId !== null) {
      saveQuestProgress(currentQuestId, questStep + 1);
      setQuestStep(questStep + 1);
    }

    // Сбрасываем только выполненное действие
    setActionState(prev => {
      const newState = { ...prev };
      delete newState[actionStep.action];
      return newState;
    });
  }, [actionState, step, questStep, steps.length, currentQuestId, saveQuestProgress, setQuestStep]);

  // Если нет квеста - ничего не рендерим
  if (!currentQuest) return null;

  // Если нет шага - квест завершен
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
    <div className={styles.questContainer}>
      <img src={Mascot} className={styles.mascotContainer} alt="mascot" />
      <div>
        <div className={styles.titleContainer}>{currentQuest.title}</div>
        <StepRenderer step={step} next={next} stepIndex={questStep} />
      </div>
    </div>
  );
};

export default QuestPlayPage;
