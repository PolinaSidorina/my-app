import { useContext } from 'react';
import { validateDistribution } from '../../constants/gameConstants';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const StatsStep = ({ step, next }) => {
  const { covers } = useContext(QuestContext);

  const { needs, wants, savings, good } = covers;
  const total = needs + wants + savings + good;

  // Вся логика проверки уже внутри validateDistribution
  const result = validateDistribution(covers, total);

  // Проценты только для наглядности (можно и убрать, если не нужно)
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
          🥖 Необходимости: {needs} ({needsPercent}%)
        </div>
        <div>
          🐷 Накопления: {savings} ({savingsPercent}%)
        </div>
        <div>
          🎮 Хотелки: {wants} ({wantsPercent}%)
        </div>
        <div>
          🎁 Добрые дела: {good} ({goodPercent}%)
        </div>

        <div className={styles.statsTotal}>💰 Всего: {total} Фини</div>

        {/* Просто показываем результат из validateDistribution */}
        {result.isValid && <div className={styles.successMessage}>{result.message}</div>}

        {!result.isValid && <div className={styles.warningMessage}>{result.message}</div>}
      </div>

      <Button text="Далее" onClick={next} />
    </div>
  );
};

export default StatsStep;
