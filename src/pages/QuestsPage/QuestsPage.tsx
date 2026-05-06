// src/pages/QuestsPage/QuestsPage.tsx
import { useContext, useState } from 'react';
import { QUEST_STATUS, QUEST_TYPE } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import { quests } from '../../data/quests';
import { Quest } from '../../types/quest.types';
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

type QuestStatus = (typeof QUEST_STATUS)[keyof typeof QUEST_STATUS];
type QuestType = (typeof QUEST_TYPE)[keyof typeof QUEST_TYPE];

const QuestsPage = () => {
  const context = useContext(QuestContext) as QuestContextValue;
  const { completedQuests, setCurrentQuestId } = context;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleQuestClick = (quest: Quest): void => {
    setCurrentQuestId(quest.id);
    setIsOpen(true);
  };

  return (
    <div className={styles.questsPageContainer}>
      <div className={styles.headerContainer}>
        <Header name="Полина" />
      </div>

      <div className={styles.planetsContainer}>
        <Planet image={Planet1} className={styles.planet1} />
        <Planet image={Planet2} className={styles.planet2} />
        <Planet image={Planet3} className={styles.planet3} />
        <Planet image={Planet4} className={styles.planet4} />

        {quests.map(quest => {
          const isCompleted = completedQuests.includes(quest.id);
          const isUnlocked = quest.id === 1 || completedQuests.includes(quest.id - 1);

          let status: QuestStatus;
          if (isCompleted) {
            status = QUEST_STATUS.COMPLETED;
          } else if (isUnlocked) {
            status = QUEST_STATUS.AVAILABLE;
          } else {
            status = QUEST_STATUS.LOCKED;
          }

          const questType = quest.type as QuestType;

          return (
            <QuestNode
              key={quest.id}
              status={status}
              style={{ left: quest.x, top: quest.y }}
              type={questType}
              onClick={() => {
                if (isUnlocked) {
                  handleQuestClick(quest as Quest);
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
