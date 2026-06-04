import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import QuestNode from './QuestNode';

describe('Компонент QuestNode', () => {
  const mockProps = {
    status: 'available',
    style: { left: '10%', top: '20%' },
    type: 'learn',
    onClick: jest.fn(),
  };

  test('отображается с правильными стилями', () => {
    render(<QuestNode {...mockProps} />);
    const node = screen.getByRole('img').parentElement;
    expect(node).toHaveStyle({ left: '10%', top: '20%' });
  });

  test('вызывает onClick при клике', () => {
    render(<QuestNode {...mockProps} />);
    const node = screen.getByRole('img').parentElement;
    fireEvent.click(node!);
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });
});
