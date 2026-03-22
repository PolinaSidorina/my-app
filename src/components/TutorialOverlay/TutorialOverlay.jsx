import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './TutorialOverlay.module.css';

const TutorialOverlay = () => {
  const { activeHighlight, stopHighlight, questStep, setQuestStep } = useContext(QuestContext);
  const [targetRect, setTargetRect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeHighlight) return;

    const timeout = setTimeout(() => {
      const findElements = () => {
        const elements = document.querySelectorAll(`[data-tutorial="${activeHighlight.target}"]`);

        if (elements.length > 0) {
          let top = Infinity;
          let left = Infinity;
          let right = -Infinity;
          let bottom = -Infinity;

          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            top = Math.min(top, rect.top);
            left = Math.min(left, rect.left);
            right = Math.max(right, rect.right);
            bottom = Math.max(bottom, rect.bottom);
          });

          setTargetRect({
            top,
            left,
            width: right - left,
            height: bottom - top,
          });
          return true;
        }
        return false;
      };

      if (findElements()) return;

      const interval = setInterval(() => {
        if (findElements()) {
          clearInterval(interval);
        }
      }, 100);

      setTimeout(() => clearInterval(interval), 3000);
    }, 300);

    return () => clearTimeout(timeout);
  }, [activeHighlight]);

  if (!activeHighlight || !targetRect) return null;

  const tooltipHeight = 150;
  const spaceBelow = window.innerHeight - targetRect.bottom;
  const showBelow = spaceBelow > tooltipHeight + 20;

  let offset = 50;
  if (activeHighlight.target === 'balance') {
    offset = -155;
  }

  let top;
  if (showBelow) {
    top = targetRect.bottom + offset;
  } else {
    top = targetRect.top - tooltipHeight - offset;
  }

  const left = targetRect.left;

  const handleNext = () => {
    stopHighlight();
    setQuestStep(questStep + 1);
    navigate('/play'); // Возвращаемся на страницу квеста
  };

  return (
    <div className={styles.overlay}>
      <div
        className={styles.highlight}
        style={{
          left: targetRect.left,
          top: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
        }}
      />
      <div
        className={styles.tooltip}
        style={{
          left,
          top,
        }}
      >
        <div>{activeHighlight.text}</div>
        <div className={styles.button}>
          <Button text="Далее" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
