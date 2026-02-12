import { useState } from 'react';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const CalculationStep = ({ step, next }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const checkAnswer = () => {
    if (Number(value) === step.correctAnswer) {
      next();
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <div className={styles.infoContainer}>{step.question}</div>
      <input
        type="number"
        value={value}
        onChange={e => {
          setValue(e.target.value);
          setError(false);
        }}
      />
      {error && <div style={{ color: 'red' }}>Попробуйте еще раз</div>}
      <Button text="Далее" onClick={next} />
    </div>
  );
};
export default CalculationStep;
