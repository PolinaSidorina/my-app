import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Cover from './Cover';

describe('Компонент Cover', () => {
  const mockProps = {
    image: 'test.svg',
    text: 'Тестовый конверт',
    value: 100,
    onAdd: jest.fn(),
    onRemove: jest.fn(),
    canAdd: true,
    canRemove: true,
  };

  test('отображает текст и значение', () => {
    render(<Cover {...mockProps} />);
    expect(screen.getByText('Тестовый конверт')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('вызывает onAdd при клике на +', () => {
    render(<Cover {...mockProps} />);
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);
    expect(mockProps.onAdd).toHaveBeenCalledTimes(1);
  });

  test('вызывает onRemove при клике на -', () => {
    render(<Cover {...mockProps} />);
    const removeButton = screen.getByText('−');
    fireEvent.click(removeButton);
    expect(mockProps.onRemove).toHaveBeenCalledTimes(1);
  });

  test('кнопка + отключена при canAdd=false', () => {
    render(<Cover {...mockProps} canAdd={false} />);
    const addButton = screen.getByText('+');
    expect(addButton).toBeDisabled();
  });

  test('кнопка - отключена при canRemove=false', () => {
    render(<Cover {...mockProps} canRemove={false} />);
    const removeButton = screen.getByText('−');
    expect(removeButton).toBeDisabled();
  });
});
