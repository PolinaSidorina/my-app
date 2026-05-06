import Crystal from '../../img/crystal.svg';
import styles from '../AddCrystal/AddCrystal.module.css';

type AddCrystalProps = {
  text: string;
};

const AddCrystal = function ({ text }: AddCrystalProps) {
  return (
    <div className={styles.addCrystalContainer}>
      <div className={styles.textContainer}>{text}</div>
      <img className={styles.imgContainer} src={Crystal} alt="crystal" />
    </div>
  );
};
export default AddCrystal;
