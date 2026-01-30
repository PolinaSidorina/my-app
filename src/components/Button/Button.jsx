import styles from './Button.module.css';
const StarQuestButton = function ({ image, text }) {
  return (
    <div className={styles.buttonContainer}>
      <img src={image} alt="icon" className={styles.imgContainer} />

      <div className={styles.textContainer}>{text}</div>
    </div>
  );
};
export default StarQuestButton;
