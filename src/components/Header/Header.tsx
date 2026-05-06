import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import AvatarImage from '../../img/avatar.png';
import Avatar from '../Avatar/Avatar';
import styles from '../Header/Header.module.css';

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  const context = useContext(QuestContext) as QuestContextValue;
  const { level, progress } = context;
  return (
    <div className={styles.headerContainer}>
      <NavLink to={'/home'}>
        <Avatar avatar={AvatarImage} />
      </NavLink>

      <div className={styles.infoContainer}>
        <div className={styles.nameContainer}>{name}</div>
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
