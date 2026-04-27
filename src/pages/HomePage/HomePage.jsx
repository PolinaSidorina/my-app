import Header from '../../components/Header/Header';
import MainQuest from '../../components/MainQuest/MainQuest';
import MenuButton from '../../components/MenuButton/MenuButton';
import Target from '../../components/Target/Target';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';
import AchievementIcon from '../../img/achievement.svg';
import BudgetIcon from '../../img/budget.svg';
import Mascot from '../../img/mascot.svg';
import QuestsIcon from '../../img/quests.svg';
import ShopIcon from '../../img/shop.svg';
import styles from './HomePage.module.css';

const HomePage = function () {
  return (
    <div className={styles.homePageContainer}>
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.mainContainer}>
        <MainQuest />
        <Target />
      </div>
      <div className={styles.menuContainer}>
        <img src={Mascot} alt="mascot" className={styles.mascotContainer} />
        <div className={styles.buttonsContainer}>
          <div data-tutorial={HIGHLIGHT_TARGETS.MENU_QUESTS}>
            <MenuButton text="Квесты" icon={QuestsIcon} link="/quests" />
          </div>
          <div data-tutorial={HIGHLIGHT_TARGETS.MENU_BUDGET}>
            <MenuButton text="Бюджет" icon={BudgetIcon} link="/budget" />
          </div>
          <div>
            <MenuButton text="Достижения" icon={AchievementIcon} />
          </div>
          <div>
            <MenuButton text="Магазин" icon={ShopIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
