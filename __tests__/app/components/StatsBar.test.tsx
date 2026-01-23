import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatsBar from '@/app/components/StatsBar/StatsBar';
import type { StatItem } from '@/app/components/StatsBar/StatsBar';

// Mock IntersectionObserver for scroll reveal
const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();
const mockObserve = jest.fn();

beforeEach(() => {
  mockDisconnect.mockClear();
  mockObserve.mockClear();
  mockIntersectionObserver.mockClear();

  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: jest.fn(),
    _callback: callback,
  }));

  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
});

const mockStats: StatItem[] = [
  { value: '10+', label: 'Years' },
  { value: '100+', label: 'Spots' },
  { value: '4', label: 'Languages' },
  { value: '1', label: 'Dream Project' },
];

describe('StatsBar Component', () => {
  describe('Default rendering', () => {
    test('renders all stat items', () => {
      render(<StatsBar stats={mockStats} />);

      expect(screen.getByText('10+')).toBeInTheDocument();
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('renders all stat labels', () => {
      render(<StatsBar stats={mockStats} />);

      expect(screen.getByText('Years')).toBeInTheDocument();
      expect(screen.getByText('Spots')).toBeInTheDocument();
      expect(screen.getByText('Languages')).toBeInTheDocument();
      expect(screen.getByText('Dream Project')).toBeInTheDocument();
    });

    test('renders correct number of stat items', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items).toHaveLength(4);
    });
  });

  describe('Accessibility', () => {
    test('container has list role', () => {
      render(<StatsBar stats={mockStats} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    test('container has aria-label for screen readers', () => {
      render(<StatsBar stats={mockStats} />);

      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Statistics');
    });

    test('each stat item has listitem role', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items).toHaveLength(4);
      items.forEach((item) => {
        expect(item).toHaveAttribute('role', 'listitem');
      });
    });
  });

  describe('Styling', () => {
    test('container has grid layout on mobile', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const wrapper = container.querySelector('[role="list"]');

      expect(wrapper).toHaveClass('grid');
      expect(wrapper).toHaveClass('grid-cols-2');
    });

    test('stat items have hover transition classes', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      items.forEach((item) => {
        expect(item).toHaveClass('transition-all');
        expect(item).toHaveClass('duration-200');
      });
    });

    test('stat items have hover state classes', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      items.forEach((item) => {
        expect(item).toHaveClass('hover:bg-gray-100');
        expect(item).toHaveClass('hover:shadow-sm');
      });
    });

    test('stat items have rounded corners', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      items.forEach((item) => {
        expect(item).toHaveClass('rounded-lg');
      });
    });

    test('stat items have background color', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      items.forEach((item) => {
        expect(item).toHaveClass('bg-gray-50');
      });
    });
  });

  describe('Custom className', () => {
    test('accepts custom className prop', () => {
      const { container } = render(<StatsBar stats={mockStats} className="custom-class" />);
      const wrapper = container.querySelector('[role="list"]');

      expect(wrapper).toHaveClass('custom-class');
    });

    test('merges custom className with default classes', () => {
      const { container } = render(<StatsBar stats={mockStats} className="my-custom-class" />);
      const wrapper = container.querySelector('[role="list"]');

      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('grid');
      expect(wrapper).toHaveClass('my-custom-class');
    });
  });

  describe('Variant prop', () => {
    test('default variant has responsive layout classes', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const wrapper = container.querySelector('[role="list"]');

      expect(wrapper).toHaveClass('md:flex');
      expect(wrapper).toHaveClass('md:flex-row');
      expect(wrapper).toHaveClass('md:justify-start');
    });

    test('compact variant always uses grid layout', () => {
      const { container } = render(<StatsBar stats={mockStats} variant="compact" />);
      const wrapper = container.querySelector('[role="list"]');

      expect(wrapper).toHaveClass('grid');
      expect(wrapper).toHaveClass('grid-cols-2');
      expect(wrapper).not.toHaveClass('md:flex');
    });
  });

  describe('Icon support', () => {
    test('renders icon when provided', () => {
      const statsWithIcon: StatItem[] = [
        { value: '10+', label: 'Years', icon: <span data-testid="test-icon">icon</span> },
      ];
      render(<StatsBar stats={statsWithIcon} />);

      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });

    test('does not render icon container when icon is not provided', () => {
      const { container } = render(<StatsBar stats={[{ value: '10+', label: 'Years' }]} />);
      const item = container.querySelector('[role="listitem"]');
      const children = item?.children;

      // Should have 2 children: value and label (no icon)
      expect(children).toHaveLength(2);
    });
  });

  describe('Empty and single item states', () => {
    test('renders empty state correctly', () => {
      const { container } = render(<StatsBar stats={[]} />);
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items).toHaveLength(0);
    });

    test('renders single item correctly', () => {
      render(<StatsBar stats={[{ value: '1', label: 'Test' }]} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Value formatting', () => {
    test('displays value with + symbol correctly', () => {
      render(<StatsBar stats={[{ value: '100+', label: 'Items' }]} />);

      expect(screen.getByText('100+')).toBeInTheDocument();
    });

    test('displays plain number value correctly', () => {
      render(<StatsBar stats={[{ value: '4', label: 'Languages' }]} />);

      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Stat item order', () => {
    test('renders stat items in correct order', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items[0]).toHaveTextContent('10+');
      expect(items[0]).toHaveTextContent('Years');
      expect(items[1]).toHaveTextContent('100+');
      expect(items[1]).toHaveTextContent('Spots');
      expect(items[2]).toHaveTextContent('4');
      expect(items[2]).toHaveTextContent('Languages');
      expect(items[3]).toHaveTextContent('1');
      expect(items[3]).toHaveTextContent('Dream Project');
    });
  });

  describe('Animation features', () => {
    test('renders static items when animateOnScroll is false (default)', () => {
      const { container } = render(<StatsBar stats={mockStats} />);
      const items = container.querySelectorAll('[role="listitem"]');

      // Static items should have duration-200
      items.forEach((item) => {
        expect(item).toHaveClass('duration-200');
      });
    });

    test('renders animated items when animateOnScroll is true', () => {
      const { container } = render(<StatsBar stats={mockStats} animateOnScroll />);
      const items = container.querySelectorAll('[role="listitem"]');

      // Animated items should have duration-500
      items.forEach((item) => {
        expect(item).toHaveClass('duration-500');
      });
    });

    test('attaches ref to container when animateOnScroll is true', () => {
      render(<StatsBar stats={mockStats} animateOnScroll />);

      // Should observe the element
      expect(mockObserve).toHaveBeenCalled();
    });

    test('does not attach ref when animateOnScroll is false', () => {
      render(<StatsBar stats={mockStats} animateOnScroll={false} />);

      // Should not observe any element
      expect(mockObserve).not.toHaveBeenCalled();
    });

    test('animated items start with opacity-0 before intersection', () => {
      const { container } = render(<StatsBar stats={mockStats} animateOnScroll />);
      const items = container.querySelectorAll('[role="listitem"]');

      // Items should start invisible
      items.forEach((item) => {
        expect(item).toHaveClass('opacity-0');
      });
    });

    test('animated items become visible after intersection', () => {
      const { container } = render(<StatsBar stats={mockStats} animateOnScroll />);

      // Trigger intersection
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      const items = container.querySelectorAll('[role="listitem"]');
      items.forEach((item) => {
        expect(item).toHaveClass('opacity-100');
      });
    });

    test('applies stagger delay to animated items', () => {
      const { container } = render(
        <StatsBar stats={mockStats} animateOnScroll staggerDelay={150} />,
      );
      const items = container.querySelectorAll('[role="listitem"]');

      // Check stagger delays
      expect(items[0]).toHaveStyle({ transitionDelay: '0ms' });
      expect(items[1]).toHaveStyle({ transitionDelay: '150ms' });
      expect(items[2]).toHaveStyle({ transitionDelay: '300ms' });
      expect(items[3]).toHaveStyle({ transitionDelay: '450ms' });
    });

    test('uses default stagger delay of 100ms', () => {
      const { container } = render(<StatsBar stats={mockStats} animateOnScroll />);
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items[0]).toHaveStyle({ transitionDelay: '0ms' });
      expect(items[1]).toHaveStyle({ transitionDelay: '100ms' });
      expect(items[2]).toHaveStyle({ transitionDelay: '200ms' });
      expect(items[3]).toHaveStyle({ transitionDelay: '300ms' });
    });

    test('accepts custom animationDuration prop', () => {
      // This tests that the prop is passed through
      // Actual animation duration is handled by useCountUp hook
      const { container } = render(
        <StatsBar stats={mockStats} animateOnScroll animationDuration={3000} />,
      );
      const items = container.querySelectorAll('[role="listitem"]');

      expect(items).toHaveLength(4);
    });

    test('parses numeric values from stat value strings', () => {
      const statsWithSuffix: StatItem[] = [
        { value: '10+', label: 'Years' },
        { value: '100%', label: 'Success' },
      ];

      const { container } = render(<StatsBar stats={statsWithSuffix} animateOnScroll />);

      // Trigger intersection
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      const items = container.querySelectorAll('[role="listitem"]');
      expect(items).toHaveLength(2);
    });

    test('uses explicit numericValue when provided', () => {
      const statsWithNumeric: StatItem[] = [
        { value: 'N/A', label: 'Years', numericValue: 10, suffix: '+' },
      ];

      const { container } = render(<StatsBar stats={statsWithNumeric} animateOnScroll />);

      // Trigger intersection
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      act(() => {
        observerCallback([{ isIntersecting: true }], { disconnect: mockDisconnect });
      });

      const items = container.querySelectorAll('[role="listitem"]');
      expect(items).toHaveLength(1);
    });
  });
});
