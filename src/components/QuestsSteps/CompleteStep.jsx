import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './Styles.module.css';

const CompleteStep = ({ step, next }) => {
  const { completeQuest, currentQuest } = useContext(QuestContext);
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.infoContainer}>{step.text}</div>
      <Button
        text="Завершить"
        onClick={() => {
          // completeQuest(currentQuest.id);
          next();
          navigate('/quests');
        }}
      />
    </div>
  );
};
export default CompleteStep;
