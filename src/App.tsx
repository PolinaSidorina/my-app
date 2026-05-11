import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import TutorialOverlay from './components/TutorialOverlay/TutorialOverlay';
import AuthPage from './pages/AuthPage/AuthPage';
import BudgetPage from './pages/BudgetPage/BudgetPage';
import HomePage from './pages/HomePage/HomePage';
import QuestPlayPage from './pages/QuestPlayPage/QuestPlayPage';
import QuestsPage from './pages/QuestsPage/QuestsPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quests"
          element={
            <ProtectedRoute>
              <QuestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/play"
          element={
            <ProtectedRoute>
              <QuestPlayPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <TutorialOverlay />
    </>
  );
};

export default App;
