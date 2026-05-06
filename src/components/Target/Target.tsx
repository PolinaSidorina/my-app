import { ChangeEvent, useContext, useState } from 'react';
import { HIGHLIGHT_TARGETS, TARGET_STATES, TARGET_THRESHOLDS } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import gift_0 from '../../img/gift_0.svg';
import gift_1 from '../../img/gift_1.svg';
import gift_2 from '../../img/gift_2.svg';
import gift_3 from '../../img/gift_3.svg';
import gift_4 from '../../img/gift_4.svg';
import { Goal } from '../../types/quest.types';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './Target.module.css';

type TargetState = (typeof TARGET_STATES)[keyof typeof TARGET_STATES];

const STATE_CONFIG: Record<TargetState, { gift: string }> = {
  [TARGET_STATES.NO_TARGET]: {
    gift: gift_0,
  },
  [TARGET_STATES.EMPTY]: {
    gift: gift_0,
  },
  [TARGET_STATES.STARTED]: {
    gift: gift_1,
  },
  [TARGET_STATES.PROGRESS]: {
    gift: gift_2,
  },
  [TARGET_STATES.ALMOST]: {
    gift: gift_3,
  },
  [TARGET_STATES.DONE]: {
    gift: gift_4,
  },
};

const getTargetState = (goal: Goal | null, current: number): TargetState => {
  if (!goal) return TARGET_STATES.NO_TARGET;
  if (current === 0) return TARGET_STATES.EMPTY;

  const progress = current / goal.targetAmount;

  if (progress < TARGET_THRESHOLDS.STARTED) return TARGET_STATES.STARTED;
  if (progress < TARGET_THRESHOLDS.PROGRESS) return TARGET_STATES.PROGRESS;
  if (progress < TARGET_THRESHOLDS.DONE) return TARGET_STATES.ALMOST;

  return TARGET_STATES.DONE;
};

const Target = () => {
  const { goal, covers, createGoal } = useContext(QuestContext) as QuestContextValue;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const currentAmount = covers.savings;
  const state = getTargetState(goal, currentAmount);
  const visual = STATE_CONFIG[state];

  const handleCreateGoal = (): void => {
    if (title.trim() && amount) {
      const newGoal: Goal = {
        title: title.trim(),
        targetAmount: Number(amount),
      };
      createGoal(newGoal);
      setIsModalOpen(false);
      setTitle('');
      setAmount('');
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(e.target.value);
  };

  return (
    <>
      <div className={styles.targetContainer} data-tutorial={HIGHLIGHT_TARGETS.TARGET}>
        {state === TARGET_STATES.NO_TARGET && (
          <Button text="Создать цель" onClick={() => setIsModalOpen(true)} />
        )}

        {state !== TARGET_STATES.NO_TARGET && goal && (
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
              onChange={handleTitleChange}
              placeholder="Например: Велосипед"
            />
            <input
              className={styles.input}
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Сумма"
            />

            <Button text="Создать" disabled={!title.trim() || !amount} onClick={handleCreateGoal} />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Target;
