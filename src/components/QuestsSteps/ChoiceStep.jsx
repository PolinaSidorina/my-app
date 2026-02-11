import { useState } from 'react';
import Button from '../Button/Button';

const ChoiceStep = ({ step, next }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <div>{step.question}</div>
      {step.options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="choice"
              value={index}
              checked={selected === index}
              onChange={() => setSelected(index)}
            />
            {option.text}
          </label>
        </div>
      ))}

      <Button text="Далее" onClick={next} disabled={selected === null} />
    </div>
  );
};
export default ChoiceStep;
