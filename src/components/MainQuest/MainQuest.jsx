import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import AddCrystal from '../AddCrystal/AddCrystal';
import Button from '../Button/Button';
import styles from '../MainQuest/MainQuest.module.css';

// Импорт иконок
import learn from '../../img/learn.svg';
import plan from '../../img/plan.svg';
import play from '../../img/play.svg';
import StartIcon from '../../img/start.svg';
import think from '../../img/think.svg';

/**
 * Компонент отображения информации о квесте
 * Используется в двух режимах:
 * - modal: для текущего квеста (с кнопками управления)
 * - page: для следующего доступного квеста (только информация)
 */
const MainQuest = function ({ mode = 'page', onClose }) {
  // ============================================
  // 1. КОНФИГУРАЦИЯ
  // ============================================

  // Маппинг типов квестов на иконки
  const iconMap = {
    play,
    learn,
    think,
    plan,
  };

  // ============================================
  // 2. ХУКИ И КОНТЕКСТ
  // ============================================
  const {
    currentQuest,
    nextQuest,
    setCurrentQuestId,
    completeQuest,
    questProgressMap,
    completedQuests,
  } = useContext(QuestContext);

  const navigate = useNavigate();

  // Определяем, какой квест показывать
  // В модалке - текущий, на странице - следующий доступный
  const quest = mode === 'modal' ? currentQuest : nextQuest;

  // Защита от отсутствия квеста
  if (!quest) return null;

  // ============================================
  // 3. ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
  // ============================================

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
    // Если это не модалка (нет текущего квеста) - устанавливаем ID квеста
    if (!isInProgress) {
      setCurrentQuestId(quest.id);
    }
    // Переходим на страницу прохождения
    navigate('/play');
    // Закрываем модалку, если она открыта
    onClose?.();
  };

  /**
   * Обработчик принудительного завершения квеста
   * Доступен только в режиме модалки
   */
  const handleComplete = () => {
    completeQuest(quest.id);
    onClose?.();
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
          <button className={styles.close} onClick={onClose}>
            ✕
          </button>
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
