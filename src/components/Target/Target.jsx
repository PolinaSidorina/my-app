import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal';
import styles from '../Target/Target.module.css';

const Target = function () {
  const [goal, setGoal] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedGoal = localStorage.getItem('goal');
    if (savedGoal) {
      setGoal(savedGoal);
    }
  }, []);

  return (
    <>
      <div
        className={styles.targetContainer}
        onClick={() => {
          setInputValue(goal);
          setIsModalOpen(true);
        }}
      >
        <div className={styles.textContainer}>{goal ? goal : 'Создать цель'}</div>
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <p>Введите цель</p>

          <input
            className={styles.input}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Например: Велосипед"
          />

          <button
            onClick={() => {
              setGoal(inputValue);
              localStorage.setItem('goal', inputValue);
              setIsModalOpen(false);
            }}
          >
            Сохранить
          </button>
        </Modal>
      )}
    </>
  );
};

export default Target;
