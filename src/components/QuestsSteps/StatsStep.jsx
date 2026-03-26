// components/QuestsSteps/StatsStep.jsx
import { useContext } from 'react';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const StatsStep = ({ step, next }) => {
  const { covers } = useContext(QuestContext);

  const needs = covers.needs;
  const wants = covers.wants;
  const savings = covers.savings;
  const good = covers.good;
  const total = needs + wants + savings + good;

  const isPerfect =
    total === 200 &&
    Math.abs(needs - 100) <= 10 &&
    Math.abs(wants - 40) <= 10 &&
    Math.abs(savings - 40) <= 10 &&
    Math.abs(good - 20) <= 10;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.infoContainer}>{step.text}</div>

      <div className={styles.statsCard}>
        <div className={styles.statsTitle}>📊 Твои деньги:</div>
        <div>🥖 Необходимости: {needs}</div>
        <div>🐷 Накопления: {savings}</div>
        <div>🎮 Хотелки: {wants}</div>
        <div>🎁 Добрые дела: {good}</div>
        <div>💰 Всего: {total}</div>

        {isPerfect && <div>✅ Отлично! Ты молодец!</div>}

        {!isPerfect && <div>📝 Попробуй еще раз! Нужно: 100, 40, 40, 20</div>}
      </div>

      <Button text="Далее" onClick={next} />
    </div>
  );
};

export default StatsStep;
