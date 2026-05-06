import { ReactNode } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};
const Modal = ({ children, onClose }: ModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
