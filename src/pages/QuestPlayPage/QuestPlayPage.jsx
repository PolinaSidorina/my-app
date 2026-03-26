import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepRenderer from '../../components/QuestsSteps/StepRenderer';
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

  /**
   * Редирект на страницу квестов, если нет активного квеста
   */
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
        case 'balance':
        case 'menu_quests':
        case 'menu_budget':
        case 'target':
          navigate('/home');
          break;
        case 'cover_needs':
        case 'cover_wants':
        case 'cover_savings':
        case 'cover_good':
          navigate('/budget');
          break;
        default:
          break;
      }
    } else {
      stopHighlight();
    }
  }, [step, startHighlight, stopHighlight, navigate]);

  /**
   * Устанавливает бюджет для действия distributeMoney
   * Срабатывает, когда:
   * 1. Текущий шаг - действие distributeMoney
   * 2. Действие еще не выполнено
   * 3. Бюджет меньше требуемого
   */
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

  /**
   * Обрабатывает завершение действия
   * Срабатывает, когда actionState[step.action] становится true
   */
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

  // ============================================
  // 3. РАННИЙ ВОЗВРАТ (Guard Clauses)
  // ============================================

  // Если нет квеста - ничего не рендерим (редирект сработает выше)
  if (!currentQuest) return null;

  // Если нет шага - квест завершен
  if (!step) {
    completeQuest(currentQuest.id);
    return null;
  }

  // ============================================
  // 4. ФУНКЦИИ-ОБРАБОТЧИКИ
  // ============================================

  /**
   * Переход к следующему шагу квеста
   * Вызывается из StepRenderer при клике на "Далее"
   */
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
