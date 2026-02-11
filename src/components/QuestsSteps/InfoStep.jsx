import Button from '../Button/Button';

const InfoStep = ({ step, next }) => {
  return (
    <div>
      <div>{step.text}</div>
      <Button text={`${step.type === 'complete' ? 'Завершить' : 'Далее'}`} onClick={next} />
    </div>
  );
};
export default InfoStep;
