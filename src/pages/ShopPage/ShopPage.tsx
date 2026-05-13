import styles from './ShopPage.module.css';
import Mascot from '../../img/mascot.svg';

const ShopPage = () => {
  return (
    <div className={styles.questContainer}>
      <img src={Mascot} className={styles.mascotContainer} alt="mascot" />
      <div>
        <div className={styles.titleContainer}>Страница в разработке...</div>
      </div>
    </div>
  );
};

export default ShopPage;
