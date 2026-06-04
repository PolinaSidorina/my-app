import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { QuestContext } from '../../context/QuestContext';
import Target from './Target';

const mockContextValue = {
  goal: null,
  covers: { savings: 0 },
  createGoal: jest.fn(),
};

const renderWithContext = (component: React.ReactNode) => {
  return render(
    <QuestContext.Provider value={mockContextValue as any}>{component}</QuestContext.Provider>
  );
};

describe('Компонент Target', () => {
  test('отображает кнопку "Создать цель", когда цели нет', () => {
    renderWithContext(<Target />);
    expect(screen.getByText('Создать цель')).toBeInTheDocument();
  });

  test('открывает модальное окно при клике на кнопку', () => {
    renderWithContext(<Target />);
    fireEvent.click(screen.getByText('Создать цель'));
    expect(screen.getByText('Новая цель')).toBeInTheDocument();
  });
});
