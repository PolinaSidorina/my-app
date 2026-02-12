import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const InfoStep = ({ step, next }) => {
  const { completeQuest, currentQuest } = useContext(QuestContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (step.type === 'complete') {
      completeQuest(currentQuest.id);
      navigate('/quests');
    } else {
      next();
    }
  };
  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>
      <Button text={`${step.type === 'complete' ? 'Завершить' : 'Далее'}`} onClick={handleClick} />
    </div>
  );
};
export default InfoStep;
