import { STEP_TYPE } from '../../constants/gameConstants';
import ActionStep from './ActionStep';
import CalculationStep from './CalculationStep';
import ChoiceStep from './ChoiceStep';
import CompleteStep from './CompleteStep';
import InfoStep from './InfoStep';
import StatsStep from './StatsStep';

const StepRenderer = ({ step, next, stepIndex }) => {
  switch (step.type) {
    case STEP_TYPE.INFO:
    case STEP_TYPE.HIGHLIGHT:
    case 'timer': // timer пока нет в константах, оставляем
      return <InfoStep step={step} next={next} />;
    case STEP_TYPE.CHOICE:
      return <ChoiceStep step={step} next={next} stepIndex={stepIndex} />;
    case STEP_TYPE.CALCULATION:
      return <CalculationStep step={step} next={next} />;
    case STEP_TYPE.ACTION:
      return <ActionStep step={step} next={next} />;
    case STEP_TYPE.STATS:
      return <StatsStep step={step} next={next} />;
    case STEP_TYPE.COMPLETE:
      return <CompleteStep step={step} next={next} />;
    default:
      return <div>Неизвестный тип шага</div>;
  }
};
export default StepRenderer;
