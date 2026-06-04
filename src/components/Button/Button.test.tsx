import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

describe('Компонент Button', () => {
  test('отображает переданный текст', () => {
    render(<Button text="Нажми меня" onClick={() => {}} />);
    expect(screen.getByText('Нажми меня')).toBeInTheDocument();
  });

  test('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button text="Кнопка" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Кнопка'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('отображает иконку, если передана', () => {
    const { container } = render(<Button text="Кнопка" onClick={() => {}} image="test.svg" />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  test('кнопка неактивна при disabled=true', () => {
    render(<Button text="Кнопка" onClick={() => {}} disabled={true} />);
    const button = screen.getByText('Кнопка');
    expect(button).toBeDisabled();
  });
});
