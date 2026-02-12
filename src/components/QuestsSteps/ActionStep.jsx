import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Target from '../Target/Target';
import styles from './Styles.module.css';

const ActionStep = ({ step }) => {
  const navigate = useNavigate();

  const handleStartAction = () => {
    if (step.action === 'distributeMoney' || step.action === 'monthlyPlanning') {
      navigate('/budget', { state: { fromQuest: true } });
    }
  };

  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>
      {step.action === 'distributeMoney' ||
        (step.action === 'monthlyPlanning' && (
          <Button text="Перейти к распределению" onClick={handleStartAction} />
        ))}
      {step.action === 'createGoal' && <Target />}
    </div>
  );
};
export default ActionStep;
