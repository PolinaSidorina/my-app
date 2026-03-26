import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { QuestProvider } from './context/QuestContext';

// Запрет на выделение текста
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';
document.body.style.mozUserSelect = 'none';
document.body.style.msUserSelect = 'none';

// Запрет на копирование
document.addEventListener('copy', e => {
  e.preventDefault();
  return false;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <QuestProvider>
        <App />
      </QuestProvider>
    </HashRouter>
  </React.StrictMode>
);
