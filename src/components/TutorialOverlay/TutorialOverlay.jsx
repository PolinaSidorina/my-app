import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Button from '../Button/Button';
import styles from './TutorialOverlay.module.css';

const TutorialOverlay = () => {
  const { activeHighlight, stopHighlight, questStep, setQuestStep } = useContext(QuestContext);
  const [targetRect, setTargetRect] = useState(null);
  const navigate = useNavigate();
  const animationFrameRef = useRef(null);

  const updatePosition = () => {
    if (!activeHighlight) return;

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
    }
  };

  useEffect(() => {
    if (!activeHighlight) return;

    const findElements = () => {
      const elements = document.querySelectorAll(`[data-tutorial="${activeHighlight.target}"]`);

      if (elements.length > 0) {
        updatePosition();
        return true;
      }
      return false;
    };

    const timeout = setTimeout(() => {
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

  useEffect(() => {
    if (!activeHighlight) return;

    const handleScrollOrResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        updatePosition();
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeHighlight]);

  if (!activeHighlight || !targetRect) return null;

  const tooltipHeight = 100;
  const spaceBelow = window.innerHeight - targetRect.bottom;
  const showBelow = spaceBelow > tooltipHeight + 30;

  // Увеличенные отступы
  let offset = 25; // базовый отступ увеличил с 10 до 20

  // Для баланса делаем отступ побольше
  if (activeHighlight.target === 'balance') {
    offset = 45;
  }

  // Для конвертов тоже увеличиваем
  if (activeHighlight.target.includes('cover')) {
    offset = 25;
  }

  let top;
  if (showBelow) {
    top = targetRect.bottom + offset; // показываем снизу
  } else {
    top = targetRect.top - tooltipHeight - offset; // показываем сверху
  }

  // Проверки на выход за границы
  if (top < 10) {
    top = 55;
  }

  if (top + tooltipHeight > window.innerHeight - 10) {
    top = window.innerHeight - tooltipHeight - 10;
  }

  const tooltipWidth = 270;
  let left = targetRect.left;

  if (left + tooltipWidth > window.innerWidth - 10) {
    left = window.innerWidth - tooltipWidth - 10;
  }

  if (left < 10) {
    left = 10;
  }

  const handleNext = () => {
    stopHighlight();
    setQuestStep(questStep + 1);
    navigate('/play');
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
        <Button text="Далее" onClick={handleNext} />
      </div>
    </div>
  );
};

export default TutorialOverlay;
