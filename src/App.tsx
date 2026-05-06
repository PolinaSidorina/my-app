import { Route, Routes } from 'react-router-dom';
import TutorialOverlay from './components/TutorialOverlay/TutorialOverlay';
import BudgetPage from './pages/BudgetPage/BudgetPage';
import HomePage from './pages/HomePage/HomePage';
import QuestPlayPage from './pages/QuestPlayPage/QuestPlayPage';
import QuestsPage from './pages/QuestsPage/QuestsPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/play" element={<QuestPlayPage />} />
      </Routes>
      <TutorialOverlay />
    </>
  );
};

export default App;
