import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from '@/app/components/Divider/Divider';
import VerticalDivider from '@/app/components/VerticalDivider/VerticalDivider';

describe('Divider Component', () => {
  test('renders horizontal divider', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');

    expect(hr).toBeInTheDocument();
  });

  test('applies default classes', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');

    expect(hr).toHaveClass('my-1');
    expect(hr).toHaveClass('lg:w-full');
    expect(hr).toHaveClass('max-sm:w-full');
  });

  test('accepts custom className', () => {
    const { container } = render(<Divider className="custom-class" />);
    const hr = container.querySelector('hr');

    expect(hr).toHaveClass('custom-class');
  });

  test('merges custom className with defaults', () => {
    const { container } = render(<Divider className="border-red-500" />);
    const hr = container.querySelector('hr');

    expect(hr).toHaveClass('my-1');
    expect(hr).toHaveClass('border-red-500');
  });

  test('accepts object className syntax', () => {
    const { container } = render(<Divider className={{ 'border-2': true, 'border-dotted': false }} />);
    const hr = container.querySelector('hr');

    expect(hr).toHaveClass('border-2');
    expect(hr).not.toHaveClass('border-dotted');
  });

  test('renders without custom className', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');

    expect(hr).toBeInTheDocument();
  });

  test('handles multiple custom classes', () => {
    const { container } = render(<Divider className="border-t-2 border-gray-300 opacity-50" />);
    const hr = container.querySelector('hr');

    expect(hr).toHaveClass('border-t-2');
    expect(hr).toHaveClass('border-gray-300');
    expect(hr).toHaveClass('opacity-50');
  });

  test('renders as hr element', () => {
    const { container } = render(<Divider />);
    const hr = container.querySelector('hr');

    expect(hr?.tagName).toBe('HR');
  });
});

describe('VerticalDivider Component', () => {
  test('renders vertical divider', () => {
    const { container } = render(<VerticalDivider />);
    const span = container.querySelector('span');

    expect(span).toBeInTheDocument();
  });

  test('applies correct classes', () => {
    const { container } = render(<VerticalDivider />);
    const span = container.querySelector('span');

    expect(span).toHaveClass('border-r-[0.1px]');
    expect(span).toHaveClass('border-[#555]');
    expect(span).toHaveClass('h-6');
  });

  test('renders as span element', () => {
    const { container } = render(<VerticalDivider />);
    const span = container.querySelector('span');

    expect(span?.tagName).toBe('SPAN');
  });

  test('has border styling', () => {
    const { container } = render(<VerticalDivider />);
    const span = container.querySelector('span');

    expect(span).toHaveClass('border-r-[0.1px]');
  });

  test('has height styling', () => {
    const { container } = render(<VerticalDivider />);
    const span = container.querySelector('span');

    expect(span).toHaveClass('h-6');
  });

  test('multiple instances render independently', () => {
    const { container } = render(
      <>
        <VerticalDivider />
        <VerticalDivider />
        <VerticalDivider />
      </>
    );

    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(3);
  });

  test('can be used in flex layouts', () => {
    const { container } = render(
      <div className="flex gap-2">
        <span>Item 1</span>
        <VerticalDivider />
        <span>Item 2</span>
      </div>
    );

    const divider = container.querySelector('span.border-r-\\[0\\.1px\\]');
    expect(divider).toBeInTheDocument();
  });
});

describe('Divider Components Integration', () => {
  test('can use both dividers together', () => {
    const { container } = render(
      <div>
        <div className="flex items-center">
          <span>Left</span>
          <VerticalDivider />
          <span>Right</span>
        </div>
        <Divider />
        <div>Bottom</div>
      </div>
    );

    const hr = container.querySelector('hr');
    const span = container.querySelector('span.border-r-\\[0\\.1px\\]');

    expect(hr).toBeInTheDocument();
    expect(span).toBeInTheDocument();
  });

  test('dividers maintain their distinct styles when used together', () => {
    const { container } = render(
      <div>
        <VerticalDivider />
        <Divider className="my-4" />
      </div>
    );

    const hr = container.querySelector('hr');
    const span = container.querySelector('span');

    expect(hr).toHaveClass('my-4');
    expect(span).toHaveClass('h-6');
  });
});
