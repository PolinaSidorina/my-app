import Header from '../../components/Header/Header';
import Planet from '../../components/Planet/Planet';
import QuestNode from '../../components/QuestNode/QuestNode';
import { quests } from '../../data/quests.js';
import Planet1 from '../../img/planet1.png';
import Planet2 from '../../img/planet2.png';
import Planet3 from '../../img/planet3.png';
import Planet4 from '../../img/planet4.png';
import styles from './QuestsPage.module.css';

const QuestsPage = function () {
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
        {quests.map(q => (
          <QuestNode key={q.id} status={q.status} style={{ left: q.x, top: q.y }} type={q.type} />
        ))}
      </div>
    </div>
  );
};
export default QuestsPage;
