import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepRenderer from '../../components/QuestsSteps/StepRenderer';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';
import { QuestContext } from '../../context/QuestContext';
import Mascot from '../../img/mascot.svg';
import styles from './QuestPlayPage.module.css';

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
    startHighlight,
    stopHighlight,
  } = useContext(QuestContext);

  const navigate = useNavigate();

  // Вычисляем текущий шаг
  const steps = currentQuest?.steps || [];
  const step = steps[questStep];

  useEffect(() => {
    if (!currentQuest) {
      navigate('/quests');
    }
  }, [currentQuest, navigate]);

  // Эффект для обработки highlight
  useEffect(() => {
    if (!step) return;

    if (step.type === 'highlight') {
      startHighlight(step.target, step.text);

      switch (step.target) {
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
    if (step.action !== 'distributeMoney' && step.action !== 'monthlyPlanning') return;

    if (actionState[step.action]) return;
    if (budget < step.requiredTotal) {
      setBudget(step.requiredTotal);
    }
  }, [step, actionState, budget, setBudget]);

  useEffect(() => {
    if (!step) return;
    if (step.type !== 'action') return;

    const isDone = actionState[step.action];
    if (!isDone) return;

    // Переходим на следующий шаг (если не последний)
    if (questStep < steps.length - 1) {
      saveQuestProgress(currentQuestId, questStep + 1);
      setQuestStep(questStep + 1);
    }

    // Сбрасываем только выполненное действие
    // Оставляем другие действия (например, если их несколько в квесте)
    setActionState(prev => {
      const newState = { ...prev };
      delete newState[step.action];
      return newState;
    });
  }, [actionState, step, questStep, steps.length, currentQuestId, saveQuestProgress, setQuestStep]);

  // Если нет квеста - ничего не рендерим (редирект сработает выше)
  if (!currentQuest) return null;

  // Если нет шага - квест завершен
  if (!step) {
    completeQuest(currentQuest.id);
    return null;
  }

  const next = () => {
    if (questStep < steps.length - 1) {
      // Сохраняем прогресс и переходим на следующий шаг
      saveQuestProgress(currentQuest.id, questStep + 1);
      setQuestStep(questStep + 1);
    } else {
      // Это был последний шаг - завершаем квест
      completeQuest(currentQuest.id);
    }
  };

  // ============================================
  // 5. РЕНДЕР
  // ============================================
  return (
    <div className={styles.questContainer}>
      <img src={Mascot} className={styles.mascotContainer} />
      <div>
        <div className={styles.titleContainer}>{currentQuest.title}</div>
        <StepRenderer step={step} next={next} stepIndex={questStep} />
      </div>
    </div>
  );
};

export default QuestPlayPage;
