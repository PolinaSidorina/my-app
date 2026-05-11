import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import AvatarImage from '../../img/avatar.png';
import Avatar from '../Avatar/Avatar';
import styles from '../Header/Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const context = useContext(QuestContext) as QuestContextValue;
  const { level, progress, isLoading } = context;
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    navigate('/auth');
  };

  if (isLoading) {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.nameContainer}>Загрузка...</div>
          <div className={styles.levelLineContainer}>
            <div className={styles.levelLineFill} style={{ width: '0%' }} />
          </div>
          <div className={styles.levelText}>Загрузка данных...</div>
          <div className={styles.lvlContainer}>LVL0</div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.headerContainer}>
      <NavLink to={'/home'}>
        <Avatar avatar={AvatarImage} />
      </NavLink>

      <div className={styles.infoContainer}>
        <div className={styles.nameButtonContainer}>
          <div className={styles.nameContainer}>{username}</div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Выход
          </button>
        </div>
        <div className={styles.levelLineContainer} data-tutorial={HIGHLIGHT_TARGETS.BALANCE}>
          <div className={styles.levelLineFill} style={{ width: `${progress * 100}%` }} />
        </div>
        <div className={styles.levelText}>Еще немного до {level + 1} уровня!</div>
        <div className={styles.lvlContainer}>LVL{level}</div>
      </div>
    </div>
  );
};
export default Header;
