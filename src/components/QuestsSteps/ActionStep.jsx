import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import { ACTION_TYPES } from '../../constants/gameConstants';
import { validateDistribution } from '../../constants/gameConstants';
import Button from '../Button/Button';
import Target from '../Target/Target';
import styles from './Styles.module.css';

const ActionStep = ({ step }) => {
  const navigate = useNavigate();
  const { covers, setActionState, budget, setBudget, balance } = useContext(QuestContext);
  const hasChecked = useRef(false);

  const handleStartAction = () => {
    if (step.action === ACTION_TYPES.DISTRIBUTE_MONEY) {
      // Ставим флаг проверки
      sessionStorage.setItem('checkingDistribution', 'true');
      hasChecked.current = false;

      // Логика для 12 квеста (500 Фини)
      if (step.requiredTotal === 500) {
        // Если на балансе меньше 500, докидываем до 500
        if (balance < 500) {
          const neededAmount = 500 - balance;
          setBudget(neededAmount);
        } else {
          // Если на балансе 500+, используем текущий баланс
          setBudget(balance);
        }
      }
      // Для 3 квеста (200 Фини) — стандартная логика
      else if (step.requiredTotal === 200) {
        if (budget < step.requiredTotal) {
          setBudget(step.requiredTotal);
        }
      }

      navigate('/budget', { state: { fromQuest: true } });
    }
  };

  useEffect(() => {
    const checkDistribution = sessionStorage.getItem('checkingDistribution');
    if (checkDistribution === 'true' && !hasChecked.current && step.requiredTotal) {
      hasChecked.current = true;
      setTimeout(() => {
        // Получаем текущую сумму из конвертов
        const total = covers.needs + covers.wants + covers.savings + covers.good;

        // Для 12 квеста проверяем, что распределена ВСЯ сумма бюджета
        // Для 3 квеста проверяем 200 Фини
        const result = validateDistribution(covers, total);

        console.log(result.message);

        if (result.isValid) {
          setActionState(prev => ({ ...prev, [step.action]: true }));
        }

        sessionStorage.removeItem('checkingDistribution');
      }, 500);
    }
  }, [covers, step, setActionState]);

  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>

      {step.action === ACTION_TYPES.DISTRIBUTE_MONEY && (
        <Button text="Перейти к распределению" onClick={handleStartAction} />
      )}

      {step.action === ACTION_TYPES.CREATE_GOAL && <Target />}
    </div>
  );
};

export default ActionStep;
