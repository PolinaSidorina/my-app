import QuestIcon from '../../img/play_c.svg';
import StartIcon from '../../img/start.svg';
import AddCrystal from '../AddCrystal/AddCrystal';
import Button from '../Button/Button';
import styles from '../MainQuest/MainQuest.module.css';

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
        <Button image={StartIcon} text="Начать квест: «Умный покупатель»" />
        <AddCrystal text="+50" />
      </div>
    </div>
  );
};
export default MainQuest;
