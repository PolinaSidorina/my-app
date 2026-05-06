// src/components/QuestsSteps/CompleteStep.tsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

type CompleteStepProps = {
  step: {
    text: string;
  };
  next: () => void;
};

const CompleteStep = ({ step, next }: CompleteStepProps) => {
  const navigate = useNavigate();
  const { completeQuest, currentQuest } = useContext(QuestContext) as QuestContextValue;

  const handleComplete = (): void => {
    if (currentQuest) {
      completeQuest(currentQuest.id);
    }
    next();
    navigate('/quests');
  };

  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>
      <Button text="Завершить" onClick={handleComplete} />
    </div>
  );
};

export default CompleteStep;
