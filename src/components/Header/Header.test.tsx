import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QuestContext } from '../../context/QuestContext';
import Header from './Header';

const mockContextValue = {
  level: 5,
  progress: 0.5,
  isLoading: false,
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <QuestContext.Provider value={mockContextValue as any}>{component}</QuestContext.Provider>
    </BrowserRouter>
  );
};

describe('Компонент Header', () => {
  test('отображает уровень', () => {
    renderWithRouter(<Header name="Полина" />);
    expect(screen.getByText('LVL5')).toBeInTheDocument();
  });

  test('отображает текст прогресса', () => {
    renderWithRouter(<Header name="Полина" />);
    expect(screen.getByText(/Еще немного до/)).toBeInTheDocument();
  });

  test('отображает кнопку выхода', () => {
    renderWithRouter(<Header name="Полина" />);
    expect(screen.getByText('Выход')).toBeInTheDocument();
  });
});
