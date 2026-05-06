import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEP_TYPE } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

type InfoStepProps = {
  step: {
    text: string;
    type: string;
  };
  next: () => void;
};
const InfoStep = ({ step, next }: InfoStepProps) => {
  const { completeQuest, currentQuest } = useContext(QuestContext) as QuestContextValue;
  const navigate = useNavigate();

  const handleClick = (): void => {
    if (step.type === STEP_TYPE.COMPLETE) {
      if (currentQuest) {
        completeQuest(currentQuest.id);
      }
      navigate('/quests');
    } else {
      next();
    }
  };
  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>
      <Button
        text={`${step.type === STEP_TYPE.COMPLETE ? 'Завершить' : 'Далее'}`}
        onClick={handleClick}
      />
    </div>
  );
};
export default InfoStep;
