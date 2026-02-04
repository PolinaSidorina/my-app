import styles from './Cover.module.css';

const Cover = function ({ image, text, value, onAdd, onRemove, canAdd, canRemove }) {
  return (
    <div className={styles.coverContainer}>
      <img src={image} className={styles.img} alt="" />

      <div className={styles.overlay}>
        <button onClick={onRemove} className={styles.btn} disabled={!canRemove}>
          −
        </button>
        <div className={styles.value}>{value}</div>
        <button onClick={onAdd} className={styles.btn} disabled={!canAdd}>
          +
        </button>
      </div>

      <div className={styles.label}>{text}</div>
    </div>
  );
};

export default Cover;
