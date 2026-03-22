import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const ChoiceStep = ({ step, next, stepIndex }) => {
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    setSelected(null);
    setShowError(false);
    setIsCorrect(false);
    setShowNextButton(false);
    setResultMessage('');
  }, [stepIndex]);

  const handleCheck = () => {
    if (selected == null) return;

    const selectedOption = step.options[selected];

    // Если у опции есть effect
    if (selectedOption.effect) {
      let message = '✅ Отличный выбор!';

      // switch (selectedOption.effect) {
      //   case 'safe':
      //     message = '🔒 Копилка — безопасно! Твои 200 Фини сохранены, но доход небольшой.';
      //     break;
      //   case 'medium':
      //     message = '🏦 Банк — хороший выбор! Твои деньги работают и приносят доход.';
      //     break;
      //   case 'high':
      //     message =
      //       '🚀 Смелое решение! Риск оправдался — ты заработал 80 Фини! Но помни: в следующий раз может не повезти.';
      //     break;
      //   default:
      //     message = '✅ Отличный выбор!';
      // }
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

  const handleOptionSelect = index => {
    setSelected(index);
    setShowError(false);
    setShowNextButton(false);
    setResultMessage('');
  };

  const handleNext = () => {
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
