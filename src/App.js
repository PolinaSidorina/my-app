import { Route, Routes } from 'react-router-dom';
import TutorialOverlay from './components/TutorialOverlay/TutorialOverlay';
import BudgetPage from './pages/BudgetPage/BudgetPage';
import HomePage from './pages/HomePage/HomePage';
import QuestPlayPage from './pages/QuestPlayPage/QuestPlayPage';
import QuestsPage from './pages/QuestsPage/QuestsPage';

const App = function () {
  return (
    <>
      <Routes>
        <Route path="/#" />
        <Route path={'/home'} element={<HomePage />}></Route>
        <Route path={'/budget'} element={<BudgetPage />}></Route>
        <Route path={'/quests'} element={<QuestsPage />}></Route>
        <Route path={'/play'} element={<QuestPlayPage />}></Route>
      </Routes>
      <TutorialOverlay />
    </>
  );
};

export default App;
