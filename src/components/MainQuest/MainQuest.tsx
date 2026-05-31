import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import { quests } from '../../data/quests';
import { deleteQuest } from '../../services/api';
import { Quest } from '../../types/quest.types';
import AddCrystal from '../AddCrystal/AddCrystal';
import Button from '../Button/Button';
import styles from '../MainQuest/MainQuest.module.css';

import { QUEST_TYPE } from '../../constants/gameConstants';
import learn from '../../img/learn.svg';
import pen from '../../img/pen.svg';
import plan from '../../img/plan.svg';
import play from '../../img/play.svg';
import StartIcon from '../../img/start.svg';
import think from '../../img/think.svg';
import trash from '../../img/trash.svg';

type MainQuestProps = {
  mode?: 'page' | 'modal';
  onClose?: () => void;
  onEditQuest?: (quest: Quest) => void;
};

type IconMap = {
  [key: string]: string;
};

const MainQuest = function ({ mode = 'page', onClose, onEditQuest }: MainQuestProps) {
  const iconMap: IconMap = {
    [QUEST_TYPE.PLAY]: play,
    [QUEST_TYPE.LEARN]: learn,
    [QUEST_TYPE.THINK]: think,
    [QUEST_TYPE.PLAN]: plan,
  };

  const context = useContext(QuestContext) as QuestContextValue;
  const { serverQuests, currentQuest, setCurrentQuestId, questProgressMap, completedQuests } =
    context;
  const navigate = useNavigate();

  // Проверяем, все ли квесты пройдены
  const allQuestsCompleted = completedQuests.length === quests.length;

  // Если все квесты пройдены и это не модалка, показываем поздравление
  if (allQuestsCompleted && mode !== 'modal') {
    return (
      <div className={styles.mainQuestContainer}>
        <div className={styles.hContainer}>
          <div className={styles.textContainer}>
            <div className={styles.h1Container}>🎉 Поздравляем! 🎉</div>
            <div>Ты прошел все квесты и стал настоящим финансовым мастером!</div>
          </div>
        </div>
      </div>
    );
  }

  // Определяем, какой квест показывать
  // В модалке - текущий, на странице - следующий доступный
  let quest: Quest | null = null;

  if (mode === 'modal') {
    quest = currentQuest;
  } else {
    const foundQuest = serverQuests.find(q => !completedQuests.includes(q.id));
    quest = foundQuest || serverQuests.find(q => q.id === 1) || null;
  }

  if (!quest) return null;

  // Режим модалки = квест в процессе
  const isInProgress = mode === 'modal';

  // Проверка, завершен ли квест
  const isCompleted = completedQuests?.includes(quest.id);

  // Проверка наличия прогресса у квеста
  // progress > 0 означает, что квест был начат
  const hasProgress =
    questProgressMap && questProgressMap[quest.id] !== undefined && questProgressMap[quest.id] > 0;

  /**
   * Определяем текст кнопки в зависимости от ситуации:
   * - Если квест начат -> "Продолжить"
   * - Если квест не начат -> "Начать"
   * В модалке - краткий текст, на странице - с названием квеста
   */
  const buttonText = isInProgress
    ? hasProgress
      ? `Продолжить квест`
      : `Начать квест`
    : hasProgress
      ? `Продолжить квест: «${quest.title}»`
      : `Начать квест: «${quest.title}»`;

  // ============================================
  // 4. ФУНКЦИИ-ОБРАБОТЧИКИ
  // ============================================

  /**
   * Обработчик клика по кнопке действия
   * Запускает или продолжает квест
   */
  const handleAction = () => {
    if (!isInProgress && quest) {
      setCurrentQuestId(quest.id);
    }
    navigate('/play');
    onClose?.();
  };

  const handleDeleteQuest = async (questId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот квест?')) return;
    try {
      await deleteQuest(questId);
      if (context.refreshQuests) await context.refreshQuests();
      onClose?.();
      alert('Квест удален');
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении квеста');
    }
  };

  // ============================================
  // 5. РЕНДЕР
  // ============================================
  return (
    <div className={styles.mainQuestContainer}>
      {/* Верхняя часть с иконкой, заголовком и описанием */}
      <div className={styles.hContainer}>
        <img
          className={styles.imgContainer}
          src={iconMap[quest.type]}
          alt={`Quest type: ${quest.type}`}
        />

        <div className={styles.textContainer}>
          <div className={styles.h1Container}>{quest.title}</div>
          <div>{quest.description}</div>
        </div>

        {/* Кнопка закрытия только в модалке */}
        {mode === 'modal' && (
          <div className={styles.questActions}>
            <button
              className={styles.editBtn}
              onClick={e => {
                e.stopPropagation();
                onEditQuest?.(quest);
              }}
            >
              <img src={pen} className={styles.icon} />
            </button>
            <button
              className={styles.editBtn}
              onClick={async e => {
                e.stopPropagation();
                await handleDeleteQuest(quest.id);
              }}
            >
              <img src={trash} className={styles.icon} />
            </button>
            <button className={styles.close} onClick={onClose}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Нижняя часть с кнопками и наградой */}
      <div className={styles.buttonContainer}>
        {!isCompleted ? (
          // КВЕСТ НЕ ЗАВЕРШЕН - показываем кнопки управления
          <>
            <Button image={StartIcon} text={buttonText} onClick={handleAction} />
            <AddCrystal text={`+${quest.reward}`} />
          </>
        ) : (
          // КВЕСТ ЗАВЕРШЕН - показываем статус и награду
          <div className={styles.completedRow}>
            <span className={styles.completedText}>✓ Пройдено</span>
            <AddCrystal text={`+${quest.reward}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainQuest;
