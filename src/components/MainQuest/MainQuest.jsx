import { useContext } from 'react';
import { QuestContext } from '../../context/QuestContext';
import learn from '../../img/learn.svg';
import plan from '../../img/plan.svg';
import play from '../../img/play.svg';
import StartIcon from '../../img/start.svg';
import think from '../../img/think.svg';
import AddCrystal from '../AddCrystal/AddCrystal';
import Button from '../Button/Button';
import styles from '../MainQuest/MainQuest.module.css';

const MainQuest = function ({ mode = 'page', onClose }) {
  const iconMap = {
    play,
    learn,
    think,
    plan,
  };

  const { currentQuest, nextQuest, setCurrentQuestId, completeQuest } = useContext(QuestContext);

  const quest = mode === 'modal' ? currentQuest : nextQuest;
  if (!quest) return null;

  const isInProgress = mode === 'modal';

  return (
    <div className={styles.mainQuestContainer}>
      <div className={styles.hContainer}>
        <img className={styles.imgContainer} src={iconMap[quest.type]} alt="questIcon" />

        <div className={styles.textContainer}>
          <div className={styles.h1Container}>{quest.title}</div>
          <div>{quest.description}</div>
        </div>
        {mode === 'modal' && (
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <div className={styles.buttonContainer}>
        <Button
          image={StartIcon}
          text={isInProgress ? 'Продолжить квест' : `Начать квест: «${quest.title}»`}
          onClick={() => {
            if (!isInProgress) {
              setCurrentQuestId(quest.id);
            }
          }}
        />
        {mode === 'modal' && (
          <Button
            text="Завершить квест"
            onClick={() => {
              completeQuest(quest.id);
              onClose?.();
            }}
          />
        )}
        <AddCrystal text={`+${quest.reward}`} />
      </div>
    </div>
  );
};
export default MainQuest;
