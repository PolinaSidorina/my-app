import { NavLink } from 'react-router-dom';
import styles from '../MenuButton/MenuButton.module.css';

type MenuButtonProps = {
  text: string;
  icon: string;
  link: string;
};

const MenuButton = function ({ text, icon, link }: MenuButtonProps) {
  return (
    <NavLink to={link} className={styles.menuButtonContainer}>
      <div className={styles.textContainer}>{text}</div>
      <div className={styles.buttonContainer}>
        <img src={icon} alt="icon" className={styles.iconContainer} />
      </div>
    </NavLink>
  );
};
export default MenuButton;
