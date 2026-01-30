import Crystal from '../../img/crystal.svg';
import styles from '../AddCrystal/AddCrystal.module.css';

const AddCrystal = function ({ text }) {
  return (
    <div className={styles.addCrystalContainer}>
      <div className={styles.textContainer}>{text}</div>
      <img className={styles.imgContainer} src={Crystal} alt="crystal" />
    </div>
  );
};
export default AddCrystal;
