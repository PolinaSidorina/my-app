import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import AvatarImage from '../../img/avatar.png';
import Avatar from '../Avatar/Avatar';
import styles from '../Header/Header.module.css';
const Header = function () {
  const { level, progress, balance } = useContext(QuestContext);
  return (
    <div className={styles.headerContainer}>
      <NavLink exact to={'/home'}>
        <Avatar avatar={AvatarImage} />
      </NavLink>

      <div className={styles.infoContainer}>
        <div className={styles.nameContainer}>Полина</div>
        <div className={styles.levelLineContainer} data-tutorial="balance">
          <div className={styles.levelLineFill} style={{ width: `${progress * 100}%` }} />
        </div>
        <div className={styles.levelText}>Еще немного до {level + 1} уровня!</div>
        <div className={styles.lvlContainer}>LVL{level}</div>
      </div>
    </div>
  );
};
export default Header;
