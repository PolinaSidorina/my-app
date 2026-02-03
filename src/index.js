import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { QuestProvider } from './context/QuestContext';

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
