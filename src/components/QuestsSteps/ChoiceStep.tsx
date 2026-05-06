import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import styles from './Styles.module.css';
import { ChoiceOption } from '../../types/quest.types';

type ChoiceStepProps = {
  step: {
    question: string;
    options: ChoiceOption[];
  };
  next: () => void;
  stepIndex: number;
};

const ChoiceStep = ({ step, next, stepIndex }: ChoiceStepProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');

  useEffect(() => {
    setSelected(null);
    setShowError(false);
    setIsCorrect(false);
    setShowNextButton(false);
    setResultMessage('');
  }, [stepIndex]);

  const handleCheck = (): void => {
    if (selected == null) return;

    const selectedOption = step.options[selected];

    // Если у опции есть effect
    if (selectedOption.effect) {
      let message = '✅ Отличный выбор!';

      if (selectedOption.result) {
        message = selectedOption.result;
      }
      setResultMessage(message);
      setIsCorrect(true);
      setShowNextButton(true);
    }
    // Если у опции есть correct
    else if (selectedOption.correct !== undefined) {
      if (selectedOption.correct) {
        setIsCorrect(true);
        setShowNextButton(true);
        setResultMessage('');
      } else {
        setShowError(true);
        setIsCorrect(false);
      }
    }
  };

  const handleOptionSelect = (index: number): void => {
    setSelected(index);
    setShowError(false);
    setShowNextButton(false);
    setResultMessage('');
  };

  const handleNext = (): void => {
    next();
  };

  return (
    <div>
      <div className={styles.infoContainer}>{step.question}</div>
      <div className={styles.optionsContainer}>
        {step.options.map((option, index) => (
          <div
            key={index}
            className={`${styles.optionItem} ${selected === index ? styles.optionSelected : ''}`}
          >
            <label className={styles.optionLabel}>
              <input
                type="radio"
                name="choice"
                value={index}
                checked={selected === index}
                onChange={() => handleOptionSelect(index)}
                disabled={isCorrect}
                className={styles.radioInput}
              />
              {option.text}
            </label>
          </div>
        ))}
      </div>

      {showError && (
        <div className={styles.errorMessage}>
          <div className={styles.errorIcon}>✕</div>
          <div>Попробуй еще раз! Этот ответ не совсем верный.</div>
        </div>
      )}

      {resultMessage && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✨</div>
          <div>{resultMessage}</div>
        </div>
      )}

      {!resultMessage && isCorrect && (
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <div>Правильно! Молодец!</div>
        </div>
      )}

      {!showNextButton && (
        <Button text="Проверить" onClick={handleCheck} disabled={selected === null || isCorrect} />
      )}

      {showNextButton && <Button text="Далее" onClick={handleNext} />}
    </div>
  );
};

export default ChoiceStep;
