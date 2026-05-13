import { useEffect, useState } from 'react';
import { STEP_TYPE } from '../../constants/gameConstants';
import { addQuest, updateQuest } from '../../services/api';
import Button from '../Button/Button';
import styles from './QuestForm.module.css';
import StepBuilder from './StepBuilder/StepBuilder';

type QuestFormProps = {
  onClose: () => void;
  initialQuest?: any;
  onQuestCreated?: () => void;
};

const QuestForm = ({ onClose, initialQuest, onQuestCreated }: QuestFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reward, setReward] = useState(10);
  const [type, setType] = useState('learn');
  const [x, setX] = useState('50%');
  const [y, setY] = useState('50%');
  const [steps, setSteps] = useState<any[]>([
    { type: STEP_TYPE.INFO, text: 'Новый шаг' },
    { type: STEP_TYPE.COMPLETE, text: 'Завершение' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    reward?: string;
    x?: string;
    y?: string;
    steps?: string;
  }>({});

  const isEdit = !!initialQuest;
  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDescription(initialQuest.description);
      setReward(initialQuest.reward);
      setType(initialQuest.type);
      setX(initialQuest.x);
      setY(initialQuest.y);
      setSteps(initialQuest.steps);
    }
  }, [initialQuest]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // 1. Название
    if (!title.trim()) {
      newErrors.title = 'Введите название квеста';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Название должно содержать минимум 3 символа';
    } else if (title.trim().length > 50) {
      newErrors.title = 'Название не должно превышать 50 символов';
    }

    // 2. Описание
    if (!description.trim()) {
      newErrors.description = 'Введите описание квеста';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    } else if (description.trim().length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    // 3. Награда
    if (reward < 5) {
      newErrors.reward = 'Награда должна быть не менее 5 Фини';
    } else if (reward > 100) {
      newErrors.reward = 'Награда не может превышать 100 Фини';
    }

    // 4. Шаги
    if (steps.length === 0) {
      newErrors.steps = 'Добавьте хотя бы один шаг';
    } else {
      // Проверка каждого шага
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        // Для choice-шага
        if (step.type === 'choice') {
          if (!step.question || !step.question.trim()) {
            newErrors.steps = `Шаг ${i + 1}: введите текст вопроса`;
            break;
          }
          if (!step.options || step.options.length === 0) {
            newErrors.steps = `Шаг ${i + 1}: добавьте варианты ответов`;
            break;
          }
          const hasCorrect = step.options.some((opt: any) => opt.correct === true);
          if (!hasCorrect) {
            newErrors.steps = `Шаг ${i + 1}: отметьте правильный ответ (*)`;
            break;
          }
          continue; // пропускаем остальные проверки для choice-шага
        }

        // Для calculation-шага
        if (step.type === 'calculation') {
          if (!step.question || !step.question.trim()) {
            newErrors.steps = `Шаг ${i + 1}: введите текст вопроса`;
            break;
          }
          if (step.correctAnswer === undefined) {
            newErrors.steps = `Шаг ${i + 1}: укажите правильный ответ`;
            break;
          }
          continue; // пропускаем проверку text
        }

        // Для остальных шагов проверяем text
        if (!step.text || !step.text.trim()) {
          newErrors.steps = `Шаг ${i + 1}: введите текст`;
          break;
        }

        if (step.text.length > 500) {
          newErrors.steps = `Шаг ${i + 1}: текст не должен превышать 500 символов`;
          break;
        }

        if (step.type === 'action' && !step.action) {
          newErrors.steps = `Шаг ${i + 1}: укажите действие`;
          break;
        }

        if (step.type === 'highlight' && !step.target) {
          newErrors.steps = `Шаг ${i + 1}: укажите цель подсветки`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setReward(10);
    setType('learn');
    setSteps([
      { type: STEP_TYPE.INFO, text: 'Новый шаг' },
      { type: STEP_TYPE.COMPLETE, text: 'Завершение' },
    ]);
    setErrors({});
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const questData = {
      title,
      description,
      reward: Number(reward),
      type,
      x,
      y,
      steps,
    };

    try {
      let result;
      if (isEdit && initialQuest) {
        result = await updateQuest(initialQuest.id, questData);
        alert(`Квест "${result.title}" успешно обновлён!`);
      } else {
        result = await addQuest(questData);
        alert(`Квест "${result.title}" успешно создан!`);
      }

      if (onQuestCreated) onQuestCreated();

      resetForm();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка при сохранении квеста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>{isEdit ? '✏️ Редактировать квест' : '➕ Новый квест'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название квеста"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
          }}
          className={errors.title ? styles.errorInput : ''}
          required
        />
        {errors.title && <div className={styles.errorText}>{errors.title}</div>}
        <textarea
          placeholder="Описание"
          value={description}
          onChange={e => {
            setDescription(e.target.value);
            if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
          }}
          className={errors.description ? styles.errorInput : ''}
          required
        />
        {errors.description && <div className={styles.errorText}>{errors.description}</div>}
        <input
          type="number"
          placeholder="Награда"
          value={reward}
          onChange={e => {
            setReward(Number(e.target.value));
            if (errors.reward) setErrors(prev => ({ ...prev, reward: undefined }));
          }}
          className={errors.reward ? styles.errorInput : ''}
          required
        />
        {errors.reward && <div className={styles.errorText}>{errors.reward}</div>}
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="learn">📚 Обучающий</option>
          <option value="play">🎮 Игровой</option>
          <option value="think">🧠 Логический</option>
          <option value="plan">📋 Планирование</option>
        </select>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="X координата (например, 50%)"
            value={x}
            onChange={e => setX(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Y координата (например, 50%)"
            value={y}
            onChange={e => setY(e.target.value)}
            required
          />
        </div>
        <StepBuilder steps={steps} onChange={setSteps} />
        {errors.steps && <div className={styles.errorText}>{errors.steps}</div>}
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.buttons}>
          <Button text="Отмена" onClick={onClose} />
          <Button text="Сохранить квест" type="submit" disabled={loading} />
        </div>
      </form>
    </div>
  );
};

export default QuestForm;
