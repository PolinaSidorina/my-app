// src/pages/QuestsPage/QuestsPage.tsx
import { useContext, useState } from 'react';
import { QUEST_STATUS, QUEST_TYPE } from '../../constants/gameConstants';
import { QuestContext, QuestContextValue } from '../../context/QuestContext';
import { Quest } from '../../types/quest.types';
import { getQuestPosition } from '../../utils/storage';
import styles from './QuestsPage.module.css';

import Header from '../../components/Header/Header';
import MainQuest from '../../components/MainQuest/MainQuest';
import Modal from '../../components/Modal/Modal';
import Planet from '../../components/Planet/Planet';
import QuestForm from '../../components/QuestForm/QuestForm';
import QuestNode from '../../components/QuestNode/QuestNode';

import Planet1 from '../../img/planet1.png';
import Planet2 from '../../img/planet2.png';
import Planet3 from '../../img/planet3.png';
import Planet4 from '../../img/planet4.png';

type QuestStatus = (typeof QUEST_STATUS)[keyof typeof QUEST_STATUS];
type QuestType = (typeof QUEST_TYPE)[keyof typeof QUEST_TYPE];

const QuestsPage = () => {
  const context = useContext(QuestContext) as QuestContextValue;
  const { completedQuests, setCurrentQuestId, serverQuests, questsLoading, refreshQuests } =
    context;
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingQuest, setEditingQuest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const QUESTS_PER_PAGE = 12;
  const totalPages = Math.ceil(serverQuests.length / QUESTS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTS_PER_PAGE;
  const pageQuests = serverQuests.slice(startIndex, startIndex + QUESTS_PER_PAGE);

  const handleQuestClick = (quest: Quest): void => {
    setCurrentQuestId(quest.id);
    setIsOpen(true);
  };
  const handleQuestCreated = () => {
    setIsFormOpen(false);
    refreshQuests();
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (questsLoading) {
    return <div className={styles.loading}>Загрузка квестов...</div>;
  }

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
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={currentPage === 1} className={styles.pageBtn}>
            ← Назад
          </button>
          <span className={styles.pageInfo}>
            Страница {currentPage} из {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            Вперёд →
          </button>
        </div>
        <button
          className={styles.addQuestBtn}
          onClick={() => setIsFormOpen(true)}
          title="Добавить новый квест"
        >
          +
        </button>
        {pageQuests.map(quest => {
          const isCompleted = completedQuests.includes(quest.id);
          const isUnlocked = quest.id === 1 || completedQuests.includes(quest.id - 1);
          const position = getQuestPosition(quest.id);

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
              style={{ left: position.x, top: position.y }}
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
            <MainQuest
              mode="modal"
              onClose={() => setIsOpen(false)}
              onEditQuest={quest => {
                setEditingQuest(quest);
                setIsFormOpen(true);
              }}
            />{' '}
          </Modal>
        )}
        {isFormOpen && (
          <Modal
            onClose={() => {
              setIsFormOpen(false);
              setEditingQuest(null);
            }}
          >
            <QuestForm
              onClose={() => {
                setIsFormOpen(false);
                setEditingQuest(null);
              }}
              initialQuest={editingQuest}
              onQuestCreated={refreshQuests}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default QuestsPage;
