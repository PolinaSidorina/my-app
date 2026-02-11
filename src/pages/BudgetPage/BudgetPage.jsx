import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Cover from '../../components/Cover/Cover';
import Header from '../../components/Header/Header';
import Target from '../../components/Target/Target';
import { QuestContext } from '../../context/QuestContext';
import CoverB from '../../img/cover_blue.svg';
import CoverG from '../../img/cover_green.svg';
import CoverPi from '../../img/cover_pink.svg';
import CoverPu from '../../img/cover_purple.svg';
import Crystals from '../../img/crystals.svg';
import Mascot from '../../img/mascot_sad.svg';
import SaveIcon from '../../img/save.svg';
import styles from './BudgetPage.module.css';

const STEP = 5;
const BudgetPage = function () {
  const { budget, covers, distributeBudget } = useContext(QuestContext);
  const [allocation, setAllocation] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
    good: 0,
  });
  const remaining =
    budget - allocation.needs - allocation.wants - allocation.savings - allocation.good;
  const changeCover = (key, delta) => {
    setAllocation(prev => {
      const nextValue = prev[key] + delta;
      if (nextValue < 0) return prev;
      if (delta > 0 && remaining < delta) return prev;
      return {
        ...prev,
        [key]: nextValue,
      };
    });
  };
  const canAdd = remaining >= STEP;

  const location = useLocation();
  const navigate = useNavigate();
  const handleDistribute = () => {
    if (remaining !== 0) return;
    distributeBudget(allocation);
    setAllocation({
      needs: 0,
      wants: 0,
      savings: 0,
      good: 0,
    });
    if (location.state?.fromQuest) {
      navigate('/play');
    }
  };

  return (
    <div className={styles.budgetPageContainer}>
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.mascotAskContainer}>
          <div>Как распределишь свой заработок?</div>
          <img src={Mascot} alt="mascot" className={styles.mascotContainer} />
        </div>
        <div className={styles.bankContainer}>
          <img src={Crystals} alt="crystal" className={styles.imgContainer} />
          <div className={styles.tContainer}>
            <div className={styles.textContainer}>{remaining}</div>
            <Button image={SaveIcon} text="Сохранить выбор" onClick={handleDistribute} />
          </div>
        </div>
        <Target />
      </div>
      <div className={styles.coversContainer}>
        <Cover
          image={CoverG}
          text="Необходимости"
          value={covers.needs + allocation.needs}
          onAdd={() => changeCover('needs', STEP)}
          onRemove={() => changeCover('needs', -STEP)}
          alt="cover"
          canAdd={canAdd}
          canRemove={allocation.needs > 0}
        />
        <Cover
          image={CoverPu}
          text="Хотелки"
          value={covers.wants + allocation.wants}
          onAdd={() => changeCover('wants', STEP)}
          onRemove={() => changeCover('wants', -STEP)}
          alt="cover"
          canAdd={canAdd}
          canRemove={allocation.wants > 0}
        />
        <Cover
          image={CoverB}
          text="Накопления"
          value={covers.savings + allocation.savings}
          onAdd={() => changeCover('savings', STEP)}
          onRemove={() => changeCover('savings', -STEP)}
          alt="cover"
          canAdd={canAdd}
          canRemove={allocation.savings > 0}
        />
        <Cover
          image={CoverPi}
          text="Добрые дела"
          value={covers.good + allocation.good}
          onAdd={() => changeCover('good', STEP)}
          onRemove={() => changeCover('good', -STEP)}
          alt="cover"
          canAdd={canAdd}
          canRemove={allocation.good > 0}
        />
      </div>
    </div>
  );
};
export default BudgetPage;
