import styles from './Button.module.css';
const Button = ({ text, image, onClick }) => {
  return (
    <button className={styles.buttonContainer} onClick={onClick}>
      {image && <img src={image} alt="" />}
      {text}
    </button>
  );
};
export default Button;
