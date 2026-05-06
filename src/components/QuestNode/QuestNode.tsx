import { QUEST_STATUS, QUEST_TYPE } from '../../constants/gameConstants';
import learn from '../../img/learn.svg';
import learn_c from '../../img/learn_c.svg';
import learn_l from '../../img/learn_l.svg';
import plan from '../../img/plan.svg';
import plan_c from '../../img/plan_c.svg';
import plan_l from '../../img/plan_l.svg';
import play from '../../img/play.svg';
import play_c from '../../img/play_c.svg';
import play_l from '../../img/play_l.svg';
import think from '../../img/think.svg';
import think_c from '../../img/think_c.svg';
import think_l from '../../img/think_l.svg';
import styles from './QuestNode.module.css';

type QuestStatus = (typeof QUEST_STATUS)[keyof typeof QUEST_STATUS];
type QuestType = (typeof QUEST_TYPE)[keyof typeof QUEST_TYPE];
type IconMap = {
  [key: string]: string;
};
const iconMap: IconMap = {
  [QUEST_TYPE.LEARN]: learn,
  [QUEST_TYPE.PLAY]: play,
  [QUEST_TYPE.THINK]: think,
  [QUEST_TYPE.PLAN]: plan,
  [`${QUEST_TYPE.LEARN}_l`]: learn_l,
  [`${QUEST_TYPE.PLAY}_l`]: play_l,
  [`${QUEST_TYPE.THINK}_l`]: think_l,
  [`${QUEST_TYPE.PLAN}_l`]: plan_l,
  [`${QUEST_TYPE.LEARN}_c`]: learn_c,
  [`${QUEST_TYPE.PLAY}_c`]: play_c,
  [`${QUEST_TYPE.THINK}_c`]: think_c,
  [`${QUEST_TYPE.PLAN}_c`]: plan_c,
};
type QuestNodeProps = {
  status: QuestStatus;
  style: import('react').CSSProperties;
  type: QuestType;
  onClick: () => void;
};
const QuestNode = function ({ status, style, type, onClick }: QuestNodeProps) {
  // Используем константы для сравнения
  const isLocked = status === QUEST_STATUS.LOCKED;
  const isCompleted = status === QUEST_STATUS.COMPLETED;

  let iconKey: string;
  if (isLocked) {
    iconKey = `${type}_l`;
  } else if (isCompleted) {
    iconKey = `${type}_c`;
  } else {
    iconKey = type;
  }

  const icon = iconMap[iconKey];

  return (
    <div className={`${styles.nodeContainer} ${styles[status]}`} style={style} onClick={onClick}>
      {icon && <img src={icon} alt={type} className={styles.icon} />}
    </div>
  );
};

export default QuestNode;
