import styles from './Button.module.css';

type ButtonProps = {
  text: string;
  image?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = ({ text, image, onClick, disabled }: ButtonProps) => {
  return (
    <button className={styles.buttonContainer} onClick={onClick} disabled={disabled}>
      {image && <img src={image} alt="" className={styles.imgContainer} />}
      {text}
    </button>
  );
};
export default Button;
