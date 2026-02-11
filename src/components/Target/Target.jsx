import { useContext, useState } from 'react';
import { QuestContext } from '../../context/QuestContext';
import gift_0 from '../../img/gift_0.svg';
import gift_1 from '../../img/gift_1.svg';
import gift_2 from '../../img/gift_2.svg';
import gift_3 from '../../img/gift_3.svg';
import gift_4 from '../../img/gift_4.svg';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from '../Target/Target.module.css';

const TARGET_STATES = {
  NO_TARGET: 'NO_TARGET',
  EMPTY: 'EMPTY',
  STARTED: 'STARTED',
  PROGRESS: 'PROGRESS',
  ALMOST: 'ALMOST',
  DONE: 'DONE',
};

const STATE_CONFIG = {
  NO_TARGET: {
    ringClass: styles.ringEmpty,
    gift: gift_0,
  },
  EMPTY: {
    ringClass: styles.ringEmpty,
    gift: gift_0,
  },
  STARTED: {
    ringClass: styles.ringStart,
    gift: gift_1,
  },
  PROGRESS: {
    ringClass: styles.ringProgress,
    gift: gift_2,
  },
  ALMOST: {
    ringClass: styles.ringAlmost,
    gift: gift_3,
  },
  DONE: {
    ringClass: styles.ringDone,
    gift: gift_4,
  },
};

const getTargetState = ({ goal, current }) => {
  if (!goal) return TARGET_STATES.NO_TARGET;
  const progress = current / goal.targetAmount;
  if (current === 0) return TARGET_STATES.EMPTY;
  if (progress < 0.3) return TARGET_STATES.STARTED;
  if (progress < 0.7) return TARGET_STATES.PROGRESS;
  if (progress < 1) return TARGET_STATES.ALMOST;
  return TARGET_STATES.DONE;
};

const Target = function () {
  const { goal, covers, createGoal } = useContext(QuestContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const currentAmount = covers.savings;
  const state = getTargetState({ goal, current: currentAmount });
  const visual = STATE_CONFIG[state];

  return (
    <>
      <div className={styles.targetContainer}>
        {/* <img src={visual.gift} alt="goal" className={styles.gift} /> */}
        {state === TARGET_STATES.NO_TARGET && (
          <Button text="Создать цель" onClick={() => setIsModalOpen(true)} />
        )}{' '}
        {state !== TARGET_STATES.NO_TARGET && (
          <>
            <img src={visual.gift} alt="goal" className={styles.gift} />
            <div className={styles.textContainer}>
              <div className={styles.title}>{goal.title}</div>
              <div className={styles.progress}>
                {Math.min(currentAmount, goal.targetAmount)} / {goal.targetAmount}
              </div>
              {state === TARGET_STATES.DONE && (
                <Button text="Новая цель" onClick={() => setIsModalOpen(true)} />
              )}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className={styles.container}>
            <div>Новая цель</div>

            <input
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Например: Велосипед"
            />
            <input
              className={styles.input}
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Сумма"
            />

            <Button
              text="Создать"
              disabled={!title.trim() || !amount}
              onClick={() => {
                if (title.trim() && amount) {
                  createGoal({ title: title.trim(), targetAmount: Number(amount) });
                  setIsModalOpen(false);
                  setTitle('');
                  setAmount('');
                }
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Target;
