import { useState } from 'react';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const CalculationStep = ({ step, next }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

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
          onChange={e => {
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
