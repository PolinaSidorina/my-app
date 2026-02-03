import { useContext, useState } from 'react';
import Header from '../../components/Header/Header';
import Planet from '../../components/Planet/Planet';
import QuestModal from '../../components/QuestModal/QuestModal.jsx';
import QuestNode from '../../components/QuestNode/QuestNode';
import { QuestContext } from '../../context/QuestContext.jsx';
import { quests } from '../../data/quests';
import Planet1 from '../../img/planet1.png';
import Planet2 from '../../img/planet2.png';
import Planet3 from '../../img/planet3.png';
import Planet4 from '../../img/planet4.png';
import styles from './QuestsPage.module.css';

const QuestsPage = function () {
  const { completeQuest, completedQuests } = useContext(QuestContext);
  const [activeQuest, setActiveQuest] = useState(null);

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
        {quests.map(q => {
          const isCompleted = completedQuests.includes(q.id);
          const isUnlocked = q.id === 1 || completedQuests.includes(q.id - 1);
          return (
            <QuestNode
              key={q.id}
              status={isCompleted ? 'complited' : isUnlocked ? 'available' : 'locked'}
              style={{ left: q.x, top: q.y }}
              type={q.type}
              onClick={() => isUnlocked && setActiveQuest(q)}
            />
          );
        })}
        {activeQuest && (
          <QuestModal
            quest={activeQuest}
            onClose={() => setActiveQuest(null)}
            onComplete={completeQuest}
          />
        )}
      </div>
    </div>
  );
};
export default QuestsPage;
