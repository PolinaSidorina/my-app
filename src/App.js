import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import QuestsPage from './pages/QuestsPage/QuestsPage';

const App = function () {
  return (
    <Routes>
      <Route path="/#" />
      <Route path={'/home'} element={<HomePage />}></Route>
      <Route path={'/budget'} element={<QuestsPage />}></Route>
      <Route path={'/quests'} element={<QuestsPage />}></Route>
    </Routes>
  );
};

export default App;
