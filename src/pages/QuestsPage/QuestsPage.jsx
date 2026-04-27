// src/pages/QuestsPage/QuestsPage.jsx
import { useContext, useState } from 'react';
import { QUEST_STATUS } from '../../constants/gameConstants'; // ← добавляем импорт
import { QuestContext } from '../../context/QuestContext.jsx';
import { quests } from '../../data/quests';
import styles from './QuestsPage.module.css';

import Header from '../../components/Header/Header';
import MainQuest from '../../components/MainQuest/MainQuest';
import Modal from '../../components/Modal/Modal';
import Planet from '../../components/Planet/Planet';
import QuestNode from '../../components/QuestNode/QuestNode';

import Planet1 from '../../img/planet1.png';
import Planet2 from '../../img/planet2.png';
import Planet3 from '../../img/planet3.png';
import Planet4 from '../../img/planet4.png';

const QuestsPage = function () {
  const { completedQuests, setCurrentQuestId } = useContext(QuestContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleQuestClick = quest => {
    setCurrentQuestId(quest.id);
    setIsOpen(true);
  };

  return (
    <div className={styles.questsPageContainer}>
      <div className={styles.headerContainer}>
        <Header />
      </div>

      <div className={styles.planetsContainer}>
        <Planet image={Planet1} className={styles.planet1} />
        <Planet image={Planet2} className={styles.planet2} />
        <Planet image={Planet3} className={styles.planet3} />
        <Planet image={Planet4} className={styles.planet4} />

        {quests.map(quest => {
          const isCompleted = completedQuests.includes(quest.id);
          const isUnlocked = quest.id === 1 || completedQuests.includes(quest.id - 1);

          // ИСПРАВЛЕНО: используем константы
          let status;
          if (isCompleted) {
            status = QUEST_STATUS.COMPLETED; // 'completed'
          } else if (isUnlocked) {
            status = QUEST_STATUS.AVAILABLE; // 'available'
          } else {
            status = QUEST_STATUS.LOCKED; // 'locked'
          }

          return (
            <QuestNode
              key={quest.id}
              status={status}
              style={{ left: quest.x, top: quest.y }}
              type={quest.type}
              onClick={() => {
                if (isUnlocked) {
                  handleQuestClick(quest);
                }
              }}
            />
          );
        })}

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
