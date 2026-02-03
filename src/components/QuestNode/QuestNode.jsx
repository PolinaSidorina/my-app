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

const iconMap = {
  learn: learn,
  play: play,
  think: think,
  plan: plan,
  learn_l: learn_l,
  play_l: play_l,
  think_l: think_l,
  plan_l: plan_l,
  learn_c: learn_c,
  play_c: play_c,
  think_c: think_c,
  plan_c: plan_c,
};

const QuestNode = function ({ status, style, type, onClick }) {
  const iconKey = status === 'locked' ? `${type}_l` : status === 'complited' ? `${type}_c` : type;
  const icon = iconMap[iconKey];
  return (
    <div className={`${styles.nodeContainer} ${styles[status]}`} style={style} onClick={onClick}>
      {icon && <img src={icon} alt={type} className={styles.icon} />}
    </div>
  );
};
export default QuestNode;
