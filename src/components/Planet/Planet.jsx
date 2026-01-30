import styles from './Planet.module.css';
const Planet = function ({ image, className }) {
  return (
    <div className={`${styles.planetContainer} ${className}`}>
      <img className={styles.imgContainer} src={image} />
    </div>
  );
};
export default Planet;
