import styles from './Planet.module.css';

type PlanetProps = {
  image: string;
  className?: string;
};
const Planet = function ({ image, className = '' }: PlanetProps) {
  return (
    <div className={`${styles.planetContainer} ${className}`}>
      <img className={styles.imgContainer} src={image} />
    </div>
  );
};
export default Planet;
