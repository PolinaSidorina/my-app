import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import Target from '../Target/Target';
import styles from './Styles.module.css';

const ActionStep = ({ step }) => {
  const navigate = useNavigate();
  const { covers, setActionState, budget, setBudget } = useContext(QuestContext);
  const hasChecked = useRef(false);

  const handleStartAction = () => {
    if (
      step.action === 'distributeMoney' ||
      step.action === 'monthlyPlanning' ||
      step.action === 'distributeMoneyWithCheck'
    ) {
      // Для distributeMoneyWithCheck и monthlyPlanning сохраняем флаг проверки
      if (step.action === 'distributeMoneyWithCheck') {
        sessionStorage.setItem('checkingDistribution', 'true');
        hasChecked.current = false;
      }

      if (step.action === 'monthlyPlanning') {
        sessionStorage.setItem('checkingMonthlyPlanning', 'true');
        hasChecked.current = false;
      }

      if (budget < step.requiredTotal) {
        setBudget(step.requiredTotal);
      }
      navigate('/budget', { state: { fromQuest: true } });
    }
  };

  useEffect(() => {
    // Проверка для distributeMoneyWithCheck
    const checkDistribution = sessionStorage.getItem('checkingDistribution');
    if (checkDistribution === 'true' && !hasChecked.current && step.requiredTotal === 200) {
      hasChecked.current = true;
      setTimeout(() => {
        const needs = covers.needs;
        const wants = covers.wants;
        const savings = covers.savings;
        const good = covers.good;
        const total = needs + wants + savings + good;

        if (total === 200) {
          const needsDiff = Math.abs(needs - 100);
          const wantsDiff = Math.abs(wants - 40);
          const savingsDiff = Math.abs(savings - 40);
          const goodDiff = Math.abs(good - 20);

          if (needsDiff <= 10 && wantsDiff <= 10 && savingsDiff <= 10 && goodDiff <= 10) {
            alert('✅ Отлично! Ты очень близко к идеальному распределению!');
            setActionState(prev => ({ ...prev, [step.action]: true }));
          } else {
            alert(
              `❌ Давай попробуем еще раз!\n\nИдеальное распределение для 200 Фини:\n` +
                `Необходимости: 100 🟢\n` +
                `Накопления: 40 🔵\n` +
                `Хотелки: 40 🟣\n` +
                `Добрые дела: 20 💝\n\n` +
                `У тебя получилось:\n` +
                `Необходимости: ${needs}\n` +
                `Накопления: ${savings}\n` +
                `Хотелки: ${wants}\n` +
                `Добрые дела: ${good}`
            );
          }
        } else {
          alert(
            `❌ Нужно распределить ровно 200 Фини.\n` +
              `У тебя получилось ${total}. Попробуй еще раз!`
          );
        }
        sessionStorage.removeItem('checkingDistribution');
      }, 500);
    }

    // Проверка для monthlyPlanning
    const checkMonthly = sessionStorage.getItem('checkingMonthlyPlanning');
    if (checkMonthly === 'true' && !hasChecked.current) {
      hasChecked.current = true;
      setTimeout(() => {
        const needs = covers.needs;
        const wants = covers.wants;
        const savings = covers.savings;
        const good = covers.good;
        const total = needs + wants + savings + good;

        // Проверяем, что деньги распределены и есть накопления
        if (total > 0) {
          if (savings > 0) {
            alert(
              `✅ Отлично! Ты правильно распределил свои ${total} Фини и не забыл про накопления!`
            );
            setActionState(prev => ({ ...prev, [step.action]: true }));
          } else {
            alert(
              `❌ Важно откладывать деньги в накопления!\n\n` +
                `У тебя получилось:\n` +
                `Необходимости: ${needs}\n` +
                `Накопления: ${savings} 🔵\n` +
                `Хотелки: ${wants}\n` +
                `Добрые дела: ${good}\n\n` +
                `Попробуй оставить часть денег в Накоплениях!`
            );
          }
        } else {
          alert(
            `❌ Нужно распределить деньги по конвертам!\n` +
              `Сейчас все конверты пустые. Попробуй еще раз!`
          );
        }
        sessionStorage.removeItem('checkingMonthlyPlanning');
      }, 500);
    }
  }, [covers, step, setActionState]);

  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>

      {(step.action === 'distributeMoney' ||
        step.action === 'monthlyPlanning' ||
        step.action === 'distributeMoneyWithCheck') && (
        <Button text="Перейти к распределению" onClick={handleStartAction} />
      )}

      {step.action === 'createGoal' && <Target />}
    </div>
  );
};

export default ActionStep;
