import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const ActionStep = ({ step }) => {
  const navigate = useNavigate();
  const handleStartAction = () => {
    if (step.action === 'distributeMoney') {
      navigate('/budget', { state: { fromQuest: true } });
    }
  };

  return (
    <div>
      <div>{step.text}</div>
      <Button text="Перейти к распределению" onClick={handleStartAction} />
    </div>
  );
};
export default ActionStep;
