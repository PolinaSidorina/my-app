import styles from '../Avatar/Avatar.module.css';

type AvatarProps = {
  avatar: string;
};

const Avatar = function ({ avatar }: AvatarProps) {
  return (
    <div>
      <img alt="avatar" src={avatar} className={styles.imgContainer} />
    </div>
  );
};
export default Avatar;
