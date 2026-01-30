import styles from './Cover.module.css';
const Cover = function ({ image, text, price }) {
  return (
    <div className={styles.coverContainer}>
      <img src={image} className={styles.imgContainer} />
      <div className={styles.tContainer}>
        <div className={styles.textContainer}>{price}</div>
        <div>{text}</div>
      </div>
    </div>
  );
};
export default Cover;
