import { useContext } from 'react';
import { QuestContext } from '../../context/QuestContext';
import AddCrystal from '../AddCrystal/AddCrystal';
import styles from './QuestModal.module.css';
const QuestModal = function ({ quest, onClose }) {
  const { completeQuest, completedQuests } = useContext(QuestContext);
  const isCompleted = completedQuests.includes(quest.id);
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div>{quest.title}</div>
        <div>{quest.description}</div>
        <AddCrystal text={`${quest.reward}`} />
        <button
          disabled={isCompleted}
          onClick={() => {
            completeQuest(quest);
            onClose();
          }}
        >
          {isCompleted ? 'Квест завершен' : 'Начать квест'}
        </button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};
export default QuestModal;
