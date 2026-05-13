import styles from './Button.module.css';

type ButtonProps = {
  text: string;
  image?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({ text, image, onClick, disabled, type = 'button' }: ButtonProps) => {
  return (
    <button className={styles.buttonContainer} onClick={onClick} disabled={disabled} type={type}>
      {image && <img src={image} alt="" className={styles.imgContainer} />}
      {text}
    </button>
  );
};
export default Button;
