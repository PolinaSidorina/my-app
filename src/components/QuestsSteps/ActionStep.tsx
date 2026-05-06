import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACTION_TYPES } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import Button from '../Button/Button';
import Target from '../Target/Target';
import styles from './Styles.module.css';

type ActionStepProps = {
  step: {
    action: string;
    text: string;
    requiredTotal?: number;
  };
  next: () => void;
};

const ActionStep = ({ step, next }: ActionStepProps) => {
  const navigate = useNavigate();
  const context = useContext(QuestContext) as QuestContextValue;

  const {
    covers,
    setActionState,
    budget,
    setBudget,
    validateBudget,
    isCheckingDistribution,
    startDistributionCheck,
    stopDistributionCheck,
  } = context;

  const hasChecked = useRef(false);

  const handleStartAction = () => {
    if (step.action === ACTION_TYPES.DISTRIBUTE_MONEY) {
      startDistributionCheck();
      hasChecked.current = false;

      if (step.requiredTotal && budget < step.requiredTotal) {
        setBudget(step.requiredTotal);
      }
      navigate('/budget', { state: { fromQuest: true } });
    }
  };

  useEffect(() => {
    const requiredTotal = step.requiredTotal;
    if (isCheckingDistribution && !hasChecked.current && requiredTotal) {
      hasChecked.current = true;
      setTimeout(() => {
        const result = validateBudget(covers, requiredTotal);

        if (result.isValid) {
          setActionState(prev => ({ ...prev, [step.action]: true }));
          next();
        }

        stopDistributionCheck();
      }, 500);
    }
  }, [isCheckingDistribution, covers, step, setActionState, validateBudget, stopDistributionCheck]);

  return (
    <>
      <div>
        <div className={styles.infoContainer}>{step.text}</div>

        {step.action === ACTION_TYPES.DISTRIBUTE_MONEY && (
          <Button text="Перейти к распределению" onClick={handleStartAction} />
        )}

        {step.action === ACTION_TYPES.CREATE_GOAL && <Target />}
      </div>
    </>
  );
};

export default ActionStep;
