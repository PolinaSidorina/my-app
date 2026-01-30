import AvatarImage from '../../img/avatar.png';
import Avatar from '../Avatar/Avatar';
import styles from '../Header/Header.module.css';
const Header = function () {
  return (
    <div className={styles.headerContainer}>
      <Avatar avatar={AvatarImage} />
      <div className={styles.infoContainer}>
        <div className={styles.nameContainer}>Полина</div>
        <div className={styles.levelLineContainer}>
          <div>Еще немного до 6 уровня!</div>
        </div>
        <div className={styles.lvlContainer}>LVL5</div>
      </div>
    </div>
  );
};
export default Header;
