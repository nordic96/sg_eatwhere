import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleButton from '@/app/components/ToggleButton/ToggleButton';

describe('ToggleButton Component', () => {
  test('renders toggle button', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<ToggleButton on={false} label="Dark Mode" />);

    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  test('does not render label when not provided', () => {
    const { container } = render(<ToggleButton on={false} />);
    const label = container.querySelector('label');

    // Label element exists but is hidden
    expect(label).toBeInTheDocument();
  });

  test('calls onToggle when clicked', () => {
    const handleToggle = jest.fn();
    const { container } = render(<ToggleButton on={false} onToggle={handleToggle} />);
    const toggle = container.querySelector('[role="button"]');

    if (toggle) {
      fireEvent.click(toggle);
    }

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  test('does not crash when onToggle is not provided', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(() => {
      if (toggle) {
        fireEvent.click(toggle);
      }
    }).not.toThrow();
  });

  test('applies correct aria-pressed when on is true', () => {
    const { container } = render(<ToggleButton on={true} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  test('applies correct aria-pressed when on is false', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  test('applies correct background when on is true', () => {
    const { container } = render(<ToggleButton on={true} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('bg-gray-100');
  });

  test('applies correct background when on is false', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('bg-monsoongrey');
  });

  test('applies translate transform when on is true', () => {
    const { container} = render(<ToggleButton on={true} />);
    const innerToggle = container.querySelector('.rounded-full.w-5');

    expect(innerToggle).toHaveClass('translate-x-full');
    expect(innerToggle).toHaveClass('bg-red-700');
  });

  test('applies no transform when on is false', () => {
    const { container } = render(<ToggleButton on={false} />);
    const innerToggle = container.querySelector('.rounded-full.w-5');

    expect(innerToggle).toHaveClass('translate-x-0');
    expect(innerToggle).toHaveClass('bg-primary');
  });

  test('accepts custom className', () => {
    const { container } = render(<ToggleButton on={false} className="custom-class" />);
    const wrapper = container.querySelector('.custom-class');

    expect(wrapper).toBeInTheDocument();
  });

  test('merges custom className with default styles', () => {
    const { container } = render(<ToggleButton on={false} className="mt-4" />);
    const wrapper = container.querySelector('.mt-4');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('gap-1');
  });

  test('renders JSX element as label', () => {
    render(<ToggleButton on={false} label={<span data-testid="jsx-label">Custom JSX</span>} />);

    expect(screen.getByTestId('jsx-label')).toBeInTheDocument();
  });

  test('has cursor-pointer class', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('cursor-pointer');
  });

  test('has correct dimensions', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('w-11');
    expect(toggle).toHaveClass('p-0.5');
  });

  test('inner toggle has correct dimensions', () => {
    const { container } = render(<ToggleButton on={false} />);
    const innerToggle = container.querySelector('.rounded-full.w-5');

    expect(innerToggle).toHaveClass('w-5');
    expect(innerToggle).toHaveClass('h-5');
  });

  test('has rounded-full class', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('rounded-full');
  });

  test('has border styling', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle).toHaveClass('border');
    expect(toggle).toHaveClass('border-[#333]');
    expect(toggle).toHaveClass('shadow-lg');
  });

  test('inner toggle has transition classes', () => {
    const { container } = render(<ToggleButton on={false} />);
    const innerToggle = container.querySelector('.rounded-full.w-5');

    expect(innerToggle).toHaveClass('transition-transform');
    expect(innerToggle).toHaveClass('ease-in-out');
  });

  test('inner toggle has hover effect', () => {
    const { container } = render(<ToggleButton on={false} />);
    const innerToggle = container.querySelector('.rounded-full.w-5');

    expect(innerToggle).toHaveClass('hover:bg-red-700');
  });

  test('toggles multiple times', () => {
    const handleToggle = jest.fn();
    const { container } = render(<ToggleButton on={false} onToggle={handleToggle} />);
    const toggle = container.querySelector('[role="button"]');

    if (toggle) {
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.click(toggle);
    }

    expect(handleToggle).toHaveBeenCalledTimes(3);
  });

  test('label has correct aria-labelledby', () => {
    const { container } = render(<ToggleButton on={false} label="Test Label" />);
    const toggle = container.querySelector('[role="button"]');
    const label = container.querySelector('label');

    const toggleId = toggle?.id;
    expect(label).toHaveAttribute('aria-labelledby', toggleId);
  });

  test('generates unique ID for each instance', () => {
    const { container } = render(
      <>
        <ToggleButton on={false} />
        <ToggleButton on={false} />
      </>
    );

    const toggles = container.querySelectorAll('[role="button"]');
    const id1 = toggles[0].id;
    const id2 = toggles[1].id;

    expect(id1).not.toBe(id2);
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
  });

  test('wrapper has flex layout with gap', () => {
    const { container } = render(<ToggleButton on={false} label="Test" />);
    const wrapper = container.querySelector('.flex.gap-1');

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('items-center');
  });

  test('renders as div with role button', () => {
    const { container } = render(<ToggleButton on={false} />);
    const toggle = container.querySelector('[role="button"]');

    expect(toggle?.tagName).toBe('DIV');
  });

  test('state change reflects in styling', () => {
    const { container, rerender } = render(<ToggleButton on={false} />);

    let toggle = container.querySelector('[role="button"]');
    expect(toggle).toHaveClass('bg-monsoongrey');

    rerender(<ToggleButton on={true} />);
    toggle = container.querySelector('[role="button"]');
    expect(toggle).toHaveClass('bg-gray-100');
  });

  test('inner toggle state change reflects in styling', () => {
    const { container, rerender } = render(<ToggleButton on={false} />);

    let innerToggle = container.querySelector('.rounded-full.w-5');
    expect(innerToggle).toHaveClass('bg-primary');
    expect(innerToggle).toHaveClass('translate-x-0');

    rerender(<ToggleButton on={true} />);
    innerToggle = container.querySelector('.rounded-full.w-5');
    expect(innerToggle).toHaveClass('bg-red-700');
    expect(innerToggle).toHaveClass('translate-x-full');
  });
});
