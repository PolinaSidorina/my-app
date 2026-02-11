import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const {
    currentQuest,
    nextQuest,
    setCurrentQuestId,
    completeQuest,
    questProgressMap,
    completedQuests,
  } = useContext(QuestContext);
  const navigate = useNavigate();
  const quest = mode === 'modal' ? currentQuest : nextQuest;
  if (!quest) return null;

  const isInProgress = mode === 'modal';
  const isCompleted = completedQuests?.includes(quest.id);

  const hasProgress =
    questProgressMap && questProgressMap[quest.id] !== undefined && questProgressMap[quest.id] > 0;
  const buttonText = isInProgress
    ? 'Продолжить квест'
    : hasProgress
      ? `Продолжить квест: «${quest.title}»`
      : `Начать квест: «${quest.title}»`;
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
        {!isCompleted ? (
          <>
            <Button
              image={StartIcon}
              text={buttonText}
              onClick={() => {
                if (!isInProgress) {
                  setCurrentQuestId(quest.id);
                }
                navigate('/play');
                onClose?.();
              }}
            />
            <AddCrystal text={`+${quest.reward}`} />
          </>
        ) : (
          <div className={styles.completedRow}>
            <span className={styles.completedText}>✓ Пройдено</span>
            <AddCrystal text={`+${quest.reward}`} />
          </div>
        )}
      </div>
    </div>
  );
};
export default MainQuest;
