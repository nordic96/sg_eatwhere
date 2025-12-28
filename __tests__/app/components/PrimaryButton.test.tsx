import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrimaryButton from '@/app/components/PrimaryButton/PrimaryButton';

describe('PrimaryButton Component', () => {
  test('renders button with children', () => {
    render(<PrimaryButton>Click me</PrimaryButton>);

    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('applies primary button styling', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-primary');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('cursor-pointer');
  });

  test('applies hover styles', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('hover:bg-red-700');
  });

  test('applies active styles', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('active:bg-red-700');
  });

  test('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('accepts custom className', () => {
    render(<PrimaryButton className="custom-class">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-primary'); // Should still have primary styles
  });

  test('merges custom className with default styles', () => {
    render(<PrimaryButton className="w-full mt-4">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('w-full');
    expect(button).toHaveClass('mt-4');
    expect(button).toHaveClass('bg-primary');
  });

  test('forwards disabled prop', () => {
    render(<PrimaryButton disabled>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  test('forwards type prop', () => {
    render(<PrimaryButton type="submit">Submit</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('type', 'submit');
  });

  test('forwards aria attributes', () => {
    render(<PrimaryButton aria-label="Custom label">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });

  test('renders with JSX children', () => {
    render(
      <PrimaryButton>
        <span>Icon</span> Click me
      </PrimaryButton>
    );

    const button = screen.getByRole('button');
    expect(button).toContainHTML('<span>Icon</span>');
    expect(button).toHaveTextContent('Icon Click me');
  });

  test('handles multiple clicks', () => {
    const handleClick = jest.fn();
    render(<PrimaryButton onClick={handleClick}>Button</PrimaryButton>);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(3);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <PrimaryButton onClick={handleClick} disabled>
        Button
      </PrimaryButton>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies padding and rounded styles', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('rounded-3xl');
  });

  test('applies text size', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('text-md');
  });

  test('has gap styling for flex children', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('gap-1');
  });

  test('has items-center for vertical alignment', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('items-center');
  });

  test('applies responsive padding', () => {
    render(<PrimaryButton>Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('max-sm:px-2');
  });

  test('forwards data attributes', () => {
    render(<PrimaryButton data-testid="custom-test-id">Button</PrimaryButton>);

    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });

  test('forwards ref using forwardRef if needed', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<PrimaryButton ref={ref}>Button</PrimaryButton>);

    // If the component doesn't use forwardRef, this will be null
    // This test documents the current behavior
    expect(ref.current).toBeTruthy();
  });

  test('renders as button element', () => {
    const { container } = render(<PrimaryButton>Button</PrimaryButton>);
    const button = container.querySelector('button');

    expect(button).toBeInTheDocument();
    expect(button?.tagName).toBe('BUTTON');
  });

  test('handles empty children', () => {
    const { container } = render(<PrimaryButton />);
    const button = container.querySelector('button');

    expect(button).toBeInTheDocument();
    expect(button).toBeEmptyDOMElement();
  });

  test('forwards id prop', () => {
    render(<PrimaryButton id="unique-id">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('id', 'unique-id');
  });

  test('forwards name prop', () => {
    render(<PrimaryButton name="button-name">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('name', 'button-name');
  });

  test('forwards value prop', () => {
    render(<PrimaryButton value="button-value">Button</PrimaryButton>);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('value', 'button-value');
  });

  test('handles form submission', () => {
    const handleSubmit = jest.fn((e) => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <PrimaryButton type="submit">Submit</PrimaryButton>
      </form>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleSubmit).toHaveBeenCalled();
  });
});
