import { useContext, useState } from 'react';
import { QuestContext } from '../../context/QuestContext.jsx';
import { quests } from '../../data/quests';
import styles from './QuestsPage.module.css';

// Компоненты
import Header from '../../components/Header/Header';
import MainQuest from '../../components/MainQuest/MainQuest';
import Modal from '../../components/Modal/Modal';
import Planet from '../../components/Planet/Planet';
import QuestNode from '../../components/QuestNode/QuestNode';

// Изображения планет
import Planet1 from '../../img/planet1.png';
import Planet2 from '../../img/planet2.png';
import Planet3 from '../../img/planet3.png';
import Planet4 from '../../img/planet4.png';

/**
 * Страница выбора квестов
 * Отображает интерактивную карту с планетами и квестами
 * Каждый квест - это узел (QuestNode) с координатами
 */
const QuestsPage = function () {
  // ============================================
  // 1. ХУКИ И КОНТЕКСТ
  // ============================================
  const { currentQuest, completedQuests, setCurrentQuestId } = useContext(QuestContext);
  const [isOpen, setIsOpen] = useState(false);

  // ============================================
  // 2. ФУНКЦИИ-ОБРАБОТЧИКИ
  // ============================================

  /**
   * Открывает модалку с информацией о квесте
   * @param {Object} quest - объект квеста
   */
  const handleQuestClick = quest => {
    setCurrentQuestId(quest.id);
    setIsOpen(true);
  };

  // ============================================
  // 3. РЕНДЕР
  // ============================================
  return (
    <div className={styles.questsPageContainer}>
      {/* Шапка с балансом и уровнем */}
      <div className={styles.headerContainer}>
        <Header />
      </div>

      {/* Контейнер с планетами и квестами */}
      <div className={styles.planetsContainer}>
        {/* Планеты (декоративные элементы) */}
        <Planet image={Planet1} className={styles.planet1} />
        <Planet image={Planet2} className={styles.planet2} />
        <Planet image={Planet3} className={styles.planet3} />
        <Planet image={Planet4} className={styles.planet4} />

        {/* Рендерим все квесты из data/quests.js */}
        {quests.map(quest => {
          // --- Логика доступности квеста ---
          // 1 квест всегда доступен
          // Остальные доступны, если предыдущий завершен
          const isCompleted = completedQuests.includes(quest.id);
          const isUnlocked = quest.id === 1 || completedQuests.includes(quest.id - 1);

          // Определяем статус для стилей и иконки
          const status = isCompleted ? 'complited' : isUnlocked ? 'available' : 'locked';

          return (
            <QuestNode
              key={quest.id}
              status={status}
              // Координаты из data/quests.js (в процентах)
              style={{ left: quest.x, top: quest.y }}
              type={quest.type}
              onClick={() => {
                // Открываем модалку только для доступных квестов
                if (isUnlocked) {
                  handleQuestClick(quest);
                }
              }}
            />
          );
        })}

        {/* Модальное окно с информацией о выбранном квесте */}
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <MainQuest mode="modal" onClose={() => setIsOpen(false)} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
