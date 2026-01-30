import styles from '../Avatar/Avatar.module.css';

const Avatar = function ({ avatar }) {
  return (
    <div>
      <img alt="avatar" src={avatar} className={styles.imgContainer} />
    </div>
  );
};
export default Avatar;
