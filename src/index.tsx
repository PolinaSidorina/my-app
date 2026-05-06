import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { QuestProvider } from './context/QuestContext';

// Запрет на выделение текста
document.body.style.userSelect = 'none';
document.body.style.webkitUserSelect = 'none';

// Запрет на копирование
document.addEventListener('copy', (e: ClipboardEvent) => {
  e.preventDefault();
  return false;
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <QuestProvider>
        <App />
      </QuestProvider>
    </HashRouter>
  </React.StrictMode>
);
