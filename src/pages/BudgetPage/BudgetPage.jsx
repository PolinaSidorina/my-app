import Button from '../../components/Button/Button';
import Cover from '../../components/Cover/Cover';
import Header from '../../components/Header/Header';
import Target from '../../components/Target/Target';
import CoverB from '../../img/cover_blue.svg';
import CoverG from '../../img/cover_green.svg';
import CoverPi from '../../img/cover_pink.svg';
import CoverPu from '../../img/cover_purple.svg';
import Crystals from '../../img/crystals.svg';
import Mascot from '../../img/mascot_sad.svg';
import SaveIcon from '../../img/save.svg';
import styles from './BudgetPage.module.css';

const BudgetPage = function () {
  return (
    <div className={styles.budgetPageContainer}>
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.mascotAskContainer}>
          <div>Как распределишь свой заработок?</div>
          <img src={Mascot} alt="mascot" className={styles.mascotContainer} />
        </div>
        <div className={styles.bankContainer}>
          <img src={Crystals} alt="crystal" className={styles.imgContainer} />
          <div className={styles.tContainer}>
            <div className={styles.textContainer}>150</div>
            <Button image={SaveIcon} text="Сохранить выбор" />
          </div>
        </div>
        <Target />
      </div>
      <div className={styles.coversContainer}>
        <Cover image={CoverG} text="Необходимости" price="300" alt="cover" />
        <Cover image={CoverPu} text="Хотелки" price="150" alt="cover" />
        <Cover image={CoverB} text="Накопления" price="750" alt="cover" />
        <Cover image={CoverPi} text="Добрые дела" price="0" alt="cover" />
      </div>
    </div>
  );
};
export default BudgetPage;
