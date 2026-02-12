import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import styles from './BudgetPage.module.css';

// Компоненты
import Button from '../../components/Button/Button';
import Cover from '../../components/Cover/Cover';
import Header from '../../components/Header/Header';
import Target from '../../components/Target/Target';

// Иконки и изображения
import CoverB from '../../img/cover_blue.svg';
import CoverG from '../../img/cover_green.svg';
import CoverPi from '../../img/cover_pink.svg';
import CoverPu from '../../img/cover_purple.svg';
import Crystals from '../../img/crystals.svg';
import Mascot from '../../img/mascot_sad.svg';
import SaveIcon from '../../img/save.svg';

// Константы
const STEP = 5; // Шаг распределения (минимальная сумма)

/**
 * Страница распределения бюджета по конвертам
 * Позволяет пользователю распределить budget между 4 категориями
 * Шаг распределения = 5 единиц
 */
const BudgetPage = function () {
  // ============================================
  // 1. ХУКИ И КОНТЕКСТ
  // ============================================
  const { budget, covers, distributeBudget } = useContext(QuestContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Локальное состояние - временное распределение до сохранения
  const [allocation, setAllocation] = useState({
    needs: 0,
    wants: 0,
    savings: 0,
    good: 0,
  });

  // ============================================
  // 2. ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ
  // ============================================

  // Остаток бюджета после текущего распределения
  const remaining =
    budget - allocation.needs - allocation.wants - allocation.savings - allocation.good;

  // Можно ли добавить еще STEP к любому конверту
  const canAdd = remaining >= STEP;

  // ============================================
  // 3. ФУНКЦИИ-ОБРАБОТЧИКИ
  // ============================================

  /**
   * Изменяет распределение для конкретного конверта
   * @param {string} key - ключ конверта ('needs', 'wants', 'savings', 'good')
   * @param {number} delta - изменение (+STEP или -STEP)
   */
  const changeCover = (key, delta) => {
    setAllocation(prev => {
      const nextValue = prev[key] + delta;

      // Защита от отрицательных значений
      if (nextValue < 0) return prev;

      // Защита от превышения остатка бюджета
      if (delta > 0 && remaining < delta) return prev;

      return {
        ...prev,
        [key]: nextValue,
      };
    });
  };

  /**
   * Сохраняет распределение бюджета
   * Срабатывает при клике на "Сохранить выбор"
   */
  const handleDistribute = () => {
    // Можно сохранить только если бюджет распределен полностью
    if (remaining !== 0) return;

    // Сохраняем распределение в контекст
    distributeBudget(allocation);

    // Сбрасываем локальное состояние
    setAllocation({
      needs: 0,
      wants: 0,
      savings: 0,
      good: 0,
    });

    // Если пришли из квеста - возвращаемся на страницу прохождения
    if (location.state?.fromQuest) {
      navigate('/play');
    }
  };

  // ============================================
  // 4. РЕНДЕР
  // ============================================
  return (
    <div className={styles.budgetPageContainer}>
      {/* Шапка с балансом и уровнем */}
      <div className={styles.headerContainer}>
        <Header />
      </div>

      {/* Основной контент */}
      <div className={styles.mainContainer}>
        {/* Блок с маскотом и вопросом */}
        <div className={styles.mascotAskContainer}>
          <div>Как распределишь свой заработок?</div>
          <img src={Mascot} alt="mascot" className={styles.mascotContainer} />
        </div>

        {/* Блок с бюджетом и кнопкой сохранения */}
        <div className={styles.bankContainer}>
          <img src={Crystals} alt="crystal" className={styles.imgContainer} />
          <div className={styles.tContainer}>
            <div className={styles.textContainer}>{remaining}</div>
            <Button image={SaveIcon} text="Сохранить выбор" onClick={handleDistribute} />
          </div>
        </div>

        {/* Компонент цели (копилка) */}
        <Target />
      </div>

      {/* Конверты (4 категории) */}
      <div className={styles.coversContainer}>
        {/* Необходимости */}
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

        {/* Хотелки */}
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

        {/* Накопления */}
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

        {/* Добрые дела */}
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
