import { STEP_TYPE } from '../../constants/gameConstants';
import ActionStep from './ActionStep';
import CalculationStep from './CalculationStep';
import ChoiceStep from './ChoiceStep';
import CompleteStep from './CompleteStep';
import InfoStep from './InfoStep';
import StatsStep from './StatsStep';
import { BaseStep } from '../../types/quest.types';

type StepRendererProps = {
  step: BaseStep;
  next: () => void;
  stepIndex: number;
};
const StepRenderer = ({ step, next, stepIndex }: StepRendererProps) => {
  switch (step.type) {
    case STEP_TYPE.INFO:
    case STEP_TYPE.HIGHLIGHT:
    case 'timer': // timer пока нет в константах, оставляем
      return <InfoStep step={step as any} next={next} />;
    case STEP_TYPE.CHOICE:
      return <ChoiceStep step={step as any} next={next} stepIndex={stepIndex} />;
    case STEP_TYPE.CALCULATION:
      return <CalculationStep step={step as any} next={next} />;
    case STEP_TYPE.ACTION:
      return <ActionStep step={step as any} next={next} />;
    case STEP_TYPE.STATS:
      return <StatsStep step={step as any} next={next} />;
    case STEP_TYPE.COMPLETE:
      return <CompleteStep step={step as any} next={next} />;
    default:
      return <div>Неизвестный тип шага</div>;
  }
};
export default StepRenderer;
