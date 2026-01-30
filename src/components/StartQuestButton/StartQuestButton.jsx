import styles from '../StartQuestButton/StarQuestButton.module.css';
const StarQuestButton = function ({ image }) {
  return (
    <div className={styles.buttonContainer}>
      <img src={image} alt="icon" className={styles.imgContainer} />

      <div className={styles.textContainer}>Начать квест: «Умный покупатель»</div>
    </div>
  );
};
export default StarQuestButton;
