import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import styles from './BudgetPage.module.css';
import { HIGHLIGHT_TARGETS } from '../../constants/gameConstants';

import Button from '../../components/Button/Button';
import Cover from '../../components/Cover/Cover';
import Header from '../../components/Header/Header';
import Target from '../../components/Target/Target';

import CoverB from '../../img/cover_blue.svg';
import CoverG from '../../img/cover_green.svg';
import CoverPi from '../../img/cover_pink.svg';
import CoverPu from '../../img/cover_purple.svg';
import Crystals from '../../img/crystals.svg';
import Mascot from '../../img/mascot_sad.svg';
import SaveIcon from '../../img/save.svg';

const STEP = 5;

const BudgetPage = function () {
  const { budget, covers, distributeBudget } = useContext(QuestContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [allocation, setAllocation] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
    good: 0,
  });

  const [displayCovers, setDisplayCovers] = useState({
    needs: covers.needs,
    wants: covers.wants,
    savings: covers.savings,
    good: covers.good,
  });

  const [hasStartedDistribution, setHasStartedDistribution] = useState(false);

  useEffect(() => {
    if (!hasStartedDistribution) {
      setDisplayCovers({
        needs: covers.needs,
        wants: covers.wants,
        savings: covers.savings,
        good: covers.good,
      });
    }
  }, [covers, hasStartedDistribution]);

  const remaining =
    budget - allocation.needs - allocation.wants - allocation.savings - allocation.good;
  const canAdd = remaining >= STEP;

  const changeCover = (key, delta) => {
    // При первом клике активируем режим распределения
    if (!hasStartedDistribution) {
      setHasStartedDistribution(true);
      setDisplayCovers({
        needs: 0,
        wants: 0,
        savings: 0,
        good: 0,
      });
    }

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

  const handleDistribute = () => {
    if (remaining !== 0) return;

    distributeBudget(allocation);

    setAllocation({
      needs: 0,
      wants: 0,
      savings: 0,
      good: 0,
    });
    setHasStartedDistribution(false);

    setDisplayCovers({
      needs: covers.needs + allocation.needs,
      wants: covers.wants + allocation.wants,
      savings: covers.savings + allocation.savings,
      good: covers.good + allocation.good,
    });

    if (location.state?.fromQuest) {
      navigate('/play');
    }
  };

  const showNeeds = hasStartedDistribution ? allocation.needs : displayCovers.needs;
  const showWants = hasStartedDistribution ? allocation.wants : displayCovers.wants;
  const showSavings = hasStartedDistribution ? allocation.savings : displayCovers.savings;
  const showGood = hasStartedDistribution ? allocation.good : displayCovers.good;

  return (
    <div className={styles.budgetPageContainer}>
      <div className={styles.headerContainer}>
        <Header />
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.mascotAskContainer}>
          <div>
            Как распределишь свои финансы?
            {/* {hasStartedDistribution
              ? `Осталось распределить: ${remaining} Фини`
              : `У тебя есть ${budget} Фини для распределения`} */}
          </div>
          <img src={Mascot} alt="mascot" className={styles.mascotContainer} />
        </div>

        <div className={styles.bankContainer}>
          <img src={Crystals} alt="crystal" className={styles.imgContainer} />
          <div className={styles.tContainer}>
            <div className={styles.textContainer}>
              {hasStartedDistribution ? remaining : budget}
            </div>
            <Button
              image={SaveIcon}
              text="Сохранить выбор"
              onClick={handleDistribute}
              disabled={!hasStartedDistribution || remaining !== 0}
            />
          </div>
        </div>

        <Target />
      </div>

      <div className={styles.coversContainer}>
        <div data-tutorial={HIGHLIGHT_TARGETS.COVER_NEEDS}>
          <Cover
            image={CoverG}
            text="Необходимости"
            value={showNeeds}
            onAdd={() => changeCover('needs', STEP)}
            onRemove={() => changeCover('needs', -STEP)}
            alt="cover"
            canAdd={canAdd}
            canRemove={allocation.needs > 0}
          />
        </div>

        <div data-tutorial={HIGHLIGHT_TARGETS.COVER_WANTS}>
          <Cover
            image={CoverPu}
            text="Хотелки"
            value={showWants}
            onAdd={() => changeCover('wants', STEP)}
            onRemove={() => changeCover('wants', -STEP)}
            alt="cover"
            canAdd={canAdd}
            canRemove={allocation.wants > 0}
          />
        </div>

        <div data-tutorial={HIGHLIGHT_TARGETS.COVER_SAVINGS}>
          <Cover
            image={CoverB}
            text="Накопления"
            value={showSavings}
            onAdd={() => changeCover('savings', STEP)}
            onRemove={() => changeCover('savings', -STEP)}
            alt="cover"
            canAdd={canAdd}
            canRemove={allocation.savings > 0}
          />
        </div>

        <div data-tutorial={HIGHLIGHT_TARGETS.COVER_GOOD}>
          <Cover
            image={CoverPi}
            text="Добрые дела"
            value={showGood}
            onAdd={() => changeCover('good', STEP)}
            onRemove={() => changeCover('good', -STEP)}
            alt="cover"
            canAdd={canAdd}
            canRemove={allocation.good > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
