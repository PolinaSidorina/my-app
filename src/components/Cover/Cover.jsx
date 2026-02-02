import styles from './Cover.module.css';
const Cover = function ({ image, text, price }) {
  return (
    <div className={styles.coverContainer}>
      <img src={image} className={styles.imgContainer} />

      <div className={styles.textContainer}>{price}</div>

      <div className={styles.tContainer}>{text}</div>
    </div>
  );
};
export default Cover;
