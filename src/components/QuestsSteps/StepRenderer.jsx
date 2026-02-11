import ActionStep from './ActionStep';
import CalculationStep from './CalculationStep';
import ChoiceStep from './ChoiceStep';
import CompleteStep from './CompleteStep';
import InfoStep from './InfoStep';

const StepRenderer = ({ step, next }) => {
  switch (step.type) {
    case 'info':
    case 'highlight':
    case 'timer':
      return <InfoStep step={step} next={next} />;
    case 'choice':
      return <ChoiceStep step={step} next={next} />;
    case 'calculation':
      return <CalculationStep step={step} next={next} />;
    case 'action':
      return <ActionStep step={step} next={next} />;
    case 'complete':
      return <CompleteStep step={step} next={next} />;
    default:
      return <div>Неизвестный тип шага</div>;
  }
};
export default StepRenderer;
