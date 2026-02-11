import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';

const QuestPlayPage = function () {
  const { currentQuest, questStep, setQuestStep, completeQuest } = useContext(QuestContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentQuest) {
      navigate('/quests');
    }
  }, [currentQuest, navigate]);
  if (!currentQuest) {
    return null;
  }

  const steps = currentQuest.steps;
  const step = steps[questStep];

  const next = () => {
    if (questStep < steps.length - 1) {
      setQuestStep(prev => prev + 1);
    } else {
      completeQuest(currentQuest.id);
    }
  };

  return (
    <div>
      <div>{currentQuest.title}</div>
      <div>{step.text}</div>
      <button onClick={next}>{questStep === steps.length - 1 ? 'Завершить' : 'Далее'}</button>
    </div>
  );
};
export default QuestPlayPage;
