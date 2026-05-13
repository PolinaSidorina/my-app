import { STEP_TYPE } from '../../../constants/gameConstants';
import styles from './StepBuilder.module.css';

type StepBuilderProps = {
  steps: any[];
  onChange: (steps: any[]) => void;
};

const hasStepError = (step: any): boolean => {
  // Для choice-шага
  if (step.type === STEP_TYPE.CHOICE) {
    if (!step.question || !step.question.trim()) return true;
    if (!step.options || step.options.length === 0) return true;
    const hasCorrect = step.options.some((opt: any) => opt.correct === true);
    if (!hasCorrect) return true;
    return false;
  }

  // Для calculation-шага (ДО проверки text!)
  if (step.type === STEP_TYPE.CALCULATION) {
    if (!step.question || !step.question.trim()) return true;
    if (step.correctAnswer === undefined) return true;
    return false;
  }

  // Для остальных шагов проверяем text
  if (!step.text || !step.text.trim()) return true;

  // Для action-шага: не указано действие
  if (step.type === STEP_TYPE.ACTION && !step.action) return true;

  // Для highlight-шага: не указана цель
  if (step.type === STEP_TYPE.HIGHLIGHT && !step.target) return true;

  return false;
};

const StepBuilder = ({ steps, onChange }: StepBuilderProps) => {
  const addStep = () => {
    onChange([...steps, { type: STEP_TYPE.INFO, text: '' }]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    onChange(newSteps);
  };

  const updateStep = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    onChange(newSteps);
  };

  return (
    <div className={styles.stepBuilder}>
      <label>Шаги квеста</label>
      {steps.map((step, index) => {
        const stepError = hasStepError(step);

        return (
          <div key={index} className={`${styles.stepCard} ${stepError ? styles.stepError : ''}`}>
            <div className={styles.stepHeader}>
              <span>Шаг {index + 1}</span>
              <button type="button" onClick={() => removeStep(index)}>
                ✕
              </button>
            </div>

            {stepError && (
              <div className={styles.stepErrorText}>
                ⚠️ Заполните все обязательные поля этого шага
              </div>
            )}

            <select value={step.type} onChange={e => updateStep(index, 'type', e.target.value)}>
              <option value={STEP_TYPE.INFO}>📖 Информация</option>
              <option value={STEP_TYPE.HIGHLIGHT}>✨ Подсветка</option>
              <option value={STEP_TYPE.CHOICE}>❓ Выбор ответа</option>
              <option value={STEP_TYPE.CALCULATION}>🔢 Ввод числа</option>
              <option value={STEP_TYPE.ACTION}>🎬 Действие</option>
              <option value={STEP_TYPE.STATS}>📊 Статистика</option>
              <option value={STEP_TYPE.COMPLETE}>🏁 Завершение</option>
            </select>

            {step.type !== STEP_TYPE.CHOICE && step.type !== STEP_TYPE.CALCULATION && (
              <input
                type="text"
                placeholder="Текст шага *"
                value={step.text || ''}
                onChange={e => updateStep(index, 'text', e.target.value)}
              />
            )}

            {step.type === STEP_TYPE.HIGHLIGHT && (
              <input
                type="text"
                placeholder="Цель подсветки * (например: balance, menu_quests)"
                value={step.target || ''}
                onChange={e => updateStep(index, 'target', e.target.value)}
              />
            )}

            {step.type === STEP_TYPE.CHOICE && (
              <>
                <input
                  type="text"
                  placeholder="Текст вопроса *"
                  value={step.question || ''}
                  onChange={e => updateStep(index, 'question', e.target.value)}
                />
                <textarea
                  placeholder="Варианты ответов (каждый с новой строки, * в конце = правильный)"
                  value={(step.options || [])
                    .map((opt: any) => (opt.correct ? `${opt.text}*` : opt.text))
                    .join('\n')}
                  onChange={e => {
                    const options = e.target.value.split('\n').filter(s => s.trim());
                    const formattedOptions = options.map(opt => ({
                      text: opt.replace('*', ''),
                      correct: opt.includes('*'),
                    }));
                    updateStep(index, 'options', formattedOptions);
                  }}
                  rows={3}
                />
              </>
            )}

            {step.type === STEP_TYPE.CALCULATION && (
              <>
                <input
                  type="text"
                  placeholder="Текст вопроса *"
                  value={step.question || ''}
                  onChange={e => updateStep(index, 'question', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Правильный ответ *"
                  value={step.correctAnswer || ''}
                  onChange={e => updateStep(index, 'correctAnswer', Number(e.target.value))}
                />
              </>
            )}

            {step.type === STEP_TYPE.ACTION && (
              <>
                <input
                  type="text"
                  placeholder="Действие * (distributeMoney, createGoal)"
                  value={step.action || ''}
                  onChange={e => updateStep(index, 'action', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Требуемая сумма (для distributeMoney)"
                  value={step.requiredTotal || ''}
                  onChange={e => updateStep(index, 'requiredTotal', Number(e.target.value))}
                />
              </>
            )}
          </div>
        );
      })}

      <button type="button" onClick={addStep} className={styles.addStepBtn}>
        + Добавить шаг
      </button>
    </div>
  );
};

export default StepBuilder;
