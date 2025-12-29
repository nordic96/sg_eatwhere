import React from 'react';
import { render, screen } from '@testing-library/react';
import RichItem from '@/app/components/SearchBar/RichItem';
import { FoodHeritage } from '@/app/types';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: (namespace: string) => (key: string) => `${namespace}.${key}`,
}));

// Mock CategoryIcon component
jest.mock('@/app/components/CategoryIcon/CategoryIcon', () => {
  return function MockCategoryIcon({ cat, className, alt }: any) {
    return <div data-testid="category-icon" data-cat={cat} className={className} aria-label={alt} />;
  };
});

describe('RichItem Component', () => {
  const mockFoodData: FoodHeritage = {
    id: 'test-1',
    name: 'Test Restaurant',
    category: 'restaurant',
    location: {
      region: 'central',
      mrt: ['NS1', 'EW12'],
      address: '123 Test Street',
      gmapUrl: 'https://maps.google.com',
      geoLocation: { latitude: 1.234, longitude: 103.456 },
    },
    recommendations: ['Dish 1', 'Dish 2'],
    imgSource: ['img1.jpg'],
  };

  test('renders food name correctly', () => {
    render(<RichItem data={mockFoodData} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  test('renders CategoryIcon with correct props', () => {
    render(<RichItem data={mockFoodData} />);
    const icon = screen.getByTestId('category-icon');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-cat', 'restaurant');
    expect(icon).toHaveClass('w-8', 'h-8');
  });

  test('renders region with translation', () => {
    render(<RichItem data={mockFoodData} />);
    expect(screen.getByText('HeritageListView.central')).toBeInTheDocument();
  });

  test('renders first MRT station with translation', () => {
    render(<RichItem data={mockFoodData} />);
    expect(screen.getByText('MRT.NS1')).toBeInTheDocument();
  });

  test('renders with different category types', () => {
    const dessertData = { ...mockFoodData, category: 'dessert' as const };
    const { rerender } = render(<RichItem data={dessertData} />);

    let icon = screen.getByTestId('category-icon');
    expect(icon).toHaveAttribute('data-cat', 'dessert');

    const hawkerData = { ...mockFoodData, category: 'hawker' as const };
    rerender(<RichItem data={hawkerData} />);

    icon = screen.getByTestId('category-icon');
    expect(icon).toHaveAttribute('data-cat', 'hawker');
  });

  test('renders with different regions', () => {
    const regions: Array<'central' | 'east' | 'west' | 'north'> = ['central', 'east', 'west', 'north'];

    regions.forEach((region) => {
      const data = { ...mockFoodData, location: { ...mockFoodData.location, region } };
      const { unmount } = render(<RichItem data={data} />);
      expect(screen.getByText(`HeritageListView.${region}`)).toBeInTheDocument();
      unmount();
    });
  });

  test('component is memoized', () => {
    const { rerender } = render(<RichItem data={mockFoodData} />);
    const firstRender = screen.getByText('Test Restaurant');

    // Re-render with same data
    rerender(<RichItem data={mockFoodData} />);
    const secondRender = screen.getByText('Test Restaurant');

    // Component should be the same due to React.memo
    expect(firstRender).toBe(secondRender);
  });

  test('renders LocationPin icon', () => {
    const { container } = render(<RichItem data={mockFoodData} />);
    // LocationPin is an MUI icon, check for its presence in the structure
    const locationContainer = container.querySelector('.flex.items-center');
    expect(locationContainer).toBeInTheDocument();
  });

  test('has correct container structure', () => {
    const { container } = render(<RichItem data={mockFoodData} />);
    const mainContainer = container.querySelector('.flex.gap-4.items-center');

    expect(mainContainer).toBeInTheDocument();
  });

  test('renders details container with correct structure', () => {
    const { container } = render(<RichItem data={mockFoodData} />);
    const detailsContainer = container.querySelector('.flex.flex-col.gap-0\\.5');

    expect(detailsContainer).toBeInTheDocument();
  });

  test('renders metadata container with correct styling', () => {
    const { container } = render(<RichItem data={mockFoodData} />);
    const metadataContainer = container.querySelector('.flex.text-xs.gap-2');

    expect(metadataContainer).toBeInTheDocument();
  });
});
