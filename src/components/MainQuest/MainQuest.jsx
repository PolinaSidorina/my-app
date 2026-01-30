import QuestIcon from '../../img/play.svg';
import StartIcon from '../../img/start.svg';
import AddCrystal from '../AddCrystal/AddCrystal';
import styles from '../MainQuest/MainQuest.module.css';
import StarQuestButton from '../StartQuestButton/StartQuestButton';

const MainQuest = function () {
  return (
    <div className={styles.mainQuestContainer}>
      <div className={styles.hContainer}>
        <img className={styles.imgContainer} src={QuestIcon} alt="questIcon" />

        <div className={styles.textContainer}>
          <div className={styles.h1Container}>Фини-задание</div>
          <div>Проверь, сможешь ли ты выбрать выгодно!</div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <StarQuestButton image={StartIcon} />
        <AddCrystal text="+50" />
      </div>
    </div>
  );
};
export default MainQuest;
