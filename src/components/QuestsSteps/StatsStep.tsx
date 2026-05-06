import { useContext } from 'react';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

type StatsStepProps = {
  step: {
    text: string;
  };
  next: () => void;
};
const StatsStep = ({ step, next }: StatsStepProps) => {
  const { covers, validateBudget, getIdealDistribution } = useContext(
    QuestContext
  ) as QuestContextValue;

  const { needs, wants, savings, good } = covers;
  const total = needs + wants + savings + good;

  const result = validateBudget(covers, total);
  const ideal = getIdealDistribution(total);

  // Проценты для наглядности
  const needsPercent = total > 0 ? Math.round((needs / total) * 100) : 0;
  const wantsPercent = total > 0 ? Math.round((wants / total) * 100) : 0;
  const savingsPercent = total > 0 ? Math.round((savings / total) * 100) : 0;
  const goodPercent = total > 0 ? Math.round((good / total) * 100) : 0;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.infoContainer}>📊 {step.text}</div>

      <div className={styles.statsCard}>
        <div className={styles.statsTitle}>📊 Твоё распределение (всего {total} Фини):</div>

        <div>
          🥖 Необходимости: {needs} ({needsPercent}%) → идеал: {ideal.needs} (50%)
        </div>
        <div>
          🐷 Накопления: {savings} ({savingsPercent}%) → идеал: {ideal.savings} (20%)
        </div>
        <div>
          🎮 Хотелки: {wants} ({wantsPercent}%) → идеал: {ideal.wants} (20%)
        </div>
        <div>
          🎁 Добрые дела: {good} ({goodPercent}%) → идеал: {ideal.good} (10%)
        </div>

        <div className={styles.statsTotal}>💰 Всего: {total} Фини</div>

        {result.isValid && <div className={styles.successMessage}>{result.message}</div>}

        {!result.isValid && <div className={styles.warningMessage}>{result.message}</div>}
      </div>

      <Button text="Далее" onClick={next} />
    </div>
  );
};

export default StatsStep;
