import { useState } from 'react';
import Button from '../Button/Button';
import styles from './Styles.module.css';

type CalculationStepProps = {
  step: {
    question: string;
    correctAnswer: number;
  };
  next: () => void;
};

const CalculationStep = ({ step, next }: CalculationStepProps) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  const checkAnswer = () => {
    if (Number(value) === step.correctAnswer) {
      setIsCorrect(true);
      setError(false);
      setShowNextButton(true);
    } else {
      setError(true);
      setIsCorrect(false);
      setShowNextButton(false);
    }
  };

  const handleNext = () => {
    next();
  };

  return (
    <div className={styles.choiceContainer}>
      <div className={styles.infoContainer}>{step.question}</div>

      <div className={styles.optionsContainer}>
        <input
          type="number"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            setError(false);
          }}
          className={`${styles.calcInput} ${error ? styles.inputError : ''} ${isCorrect ? styles.inputCorrect : ''}`}
          placeholder="Введи число"
        />
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>❌</span>
          <span>Ой! Попробуй еще раз</span>
        </div>
      )}

      {isCorrect && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✅</span>
          <span>Правильно! Молодец!</span>
        </div>
      )}

      {!showNextButton && (
        <Button text="Проверить" onClick={checkAnswer} disabled={!value || isCorrect} />
      )}

      {showNextButton && <Button text="Далее" onClick={handleNext} />}
    </div>
  );
};

export default CalculationStep;
