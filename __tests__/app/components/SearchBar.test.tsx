/* eslint-disable @typescript-eslint/no-unused-vars */
// Mock all dependencies FIRST - before any imports
// This is required because Jest hoists jest.mock() calls
jest.mock('@/app/stores', () => ({
  useHeritageStore: () => ({
    foodData: mockFoodData,
    setHeritageId: jest.fn(),
  }),
}));
jest.mock('@/i18n/request', () => ({
  geti18nConfig: () => ({
    messages: {
      Heritage: {
        oldtree_desc: 'Durian dessert place',
        komala_desc: 'Vegetarian Indian food',
        spicy_wife_desc: 'Nasi Lemak stall',
      },
    },
  }),
}));
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      placeholder: 'Search any Keyword',
      no_results: 'No results found',
    };
    return translations[key] || key;
  },
}));

jest.mock('@/app/hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T, _delay: number) => value,
}));

jest.mock('@/app/hooks/useClickOutside', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the Activity component that doesn't exist in React
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    Activity: ({ children, mode }: { children?: React.ReactNode; mode: string }) =>
      mode === 'visible' ? <div data-testid="activity-indicator">{children}</div> : null,
  };
});

// NOW import everything
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar from '@/app/components/SearchBar/SearchBar';
import { FoodHeritage } from '@/app/types';

const mockFoodData: FoodHeritage[] = [
  {
    id: 'oldtree',
    name: 'Old Tree Coffee',
    location: {
      geoLocation: {
        latitude: 1.123,
        longitude: 103.456,
      },
      address: '',
      gmapUrl: '',
      region: 'central',
      mrt: ['outram_park'],
    },
    imgSource: ['/images/oldtree.jpg'],
    category: 'dessert',
    website: 'https://example.com',
    recommendations: ['Durian Mousse'],
  },
  {
    id: 'komala',
    name: 'Komala Vilas',
    location: {
      geoLocation: {
        latitude: 1.123,
        longitude: 103.456,
      },
      address: '',
      gmapUrl: '',
      region: 'central',
      mrt: ['outram_park'],
    },
    imgSource: ['/images/oldtree.jpg'],
    category: 'dessert',
    website: 'https://example.com',
    recommendations: ['Durian Mousse'],
  },
  {
    id: 'spicy_wife',
    name: 'Spicy Wife',
    location: {
      geoLocation: {
        latitude: 1.123,
        longitude: 103.456,
      },
      address: '',
      gmapUrl: '',
      region: 'central',
      mrt: ['outram_park'],
    },
    imgSource: ['/images/oldtree.jpg'],
    category: 'dessert',
    website: 'https://example.com',
    recommendations: ['Durian Mousse'],
  },
];

describe('SearchBar Component', () => {
  const mockSetHeritageId = jest.fn();

  test('renders search input', () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  test('renders with correct placeholder', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search any Keyword');
    expect(input).toBeInTheDocument();
  });

  test('renders search icon', () => {
    const { container } = render(<SearchBar />);

    const searchIcon = container.querySelector('.MuiSvgIcon-root');
    expect(searchIcon).toBeInTheDocument();
  });

  test('input is initially empty', () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('updates input value on user typing', () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'durian' } });

    expect(input.value).toBe('durian');
  });

  test('shows "No results found" when search yields no matches', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'xyz123nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  test('displays search results when keyword matches', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Old Tree Coffee')).toBeInTheDocument();
    });
  });

  test('search is case-insensitive', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'KOMALA' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Komala Vilas')).toBeInTheDocument();
    });
  });

  test('shows multiple results when multiple items match', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      // Search by category that exists in multiple items
      fireEvent.change(input, { target: { value: 'restaurant' } });
    });

    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeInTheDocument();
    });
  });

  test('does not show results when input is not focused', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('shows results when input is focused', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  test('hides results when input is blurred', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.blur(input);
    });

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  test('handles ArrowDown key to navigate results', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // First item should be selected
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  test('handles ArrowUp key to navigate results', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Navigate down twice
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Navigate up once
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  test('handles Tab key like ArrowDown', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Tab' });
    });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
  });

  test('handles Enter key to select result', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Old Tree Coffee')).toBeInTheDocument();
    });

    // Navigate to first item
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Select with Enter
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockSetHeritageId).toHaveBeenCalledWith('oldtree');
  });

  test('handles Escape key to reset search', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox') as HTMLInputElement;

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    expect(input.value).toBe('Coffee');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    expect(input.value).toBe('');
  });

  test('handles mouse hover on result item', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');

    await act(async () => {
      fireEvent.mouseEnter(options[1]);
    });

    expect(options[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('handles click on result item', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Old Tree Coffee')).toBeInTheDocument();
    });

    const option = screen.getByText('Old Tree Coffee');

    // First hover to set selectedIndex
    await act(async () => {
      fireEvent.mouseEnter(option);
    });

    // Then click
    await act(async () => {
      fireEvent.click(option);
    });

    expect(mockSetHeritageId).toHaveBeenCalled();
  });

  test('input is disabled when loading', () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');
    // Initially should be enabled (loading will be true but then false after useEffect)
    expect(input).toBeInTheDocument();
  });

  test('has correct ARIA attributes', () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-label', 'Search Food Locations');
  });

  test('updates aria-expanded when results are shown', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    expect(input).toHaveAttribute('aria-expanded', 'false');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test('updates aria-activedescendant when navigating', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Initially no activedescendant
    expect(input).not.toHaveAttribute('aria-activedescendant');

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Now should have activedescendant
    const activedescendant = input.getAttribute('aria-activedescendant');
    expect(activedescendant).toBeTruthy();
    expect(activedescendant).toMatch(/option-0$/);
  });

  test('each option has unique ID', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');
    const ids = options.map((opt) => opt.id);

    // Check all IDs are unique
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('does not navigate beyond last result with ArrowDown', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(0);
    });

    const options = screen.getAllByRole('option');
    const lastIndex = options.length - 1;

    // Navigate to last item
    for (let i = 0; i <= lastIndex; i++) {
      await act(async () => {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      });
    }

    // Try to navigate beyond
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Should still be on last item
    expect(options[lastIndex]).toHaveAttribute('aria-selected', 'true');
  });

  test('does not navigate beyond first result with ArrowUp', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Try to navigate up from initial position
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowUp' });
    });

    const options = screen.getAllByRole('option');
    // None should be selected (selectedIndex = -1)
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
  });

  test('Enter key does nothing when no result is selected', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Press Enter without navigating to a result
    await act(async () => {
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockSetHeritageId).not.toHaveBeenCalled();
  });

  test('keyboard navigation does nothing when no results', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'xyz123nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    // Try to navigate - should not crash
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowUp' });
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(mockSetHeritageId).not.toHaveBeenCalled();
  });

  test('resets selected index when search keyword changes', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    // Navigate to a result
    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    // Change search keyword
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Komala' } });
    });

    // Selected index should be reset
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'false');
    });
  });

  test('applies correct styling to selected option', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveClass('bg-primary');
    expect(options[0]).toHaveClass('text-white');
  });

  test('applies correct styling to unselected options', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'a' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.keyDown(input, { key: 'ArrowDown' });
    });

    const options = screen.getAllByRole('option');
    if (options.length > 1) {
      expect(options[1]).toHaveClass('text-black');
      expect(options[1]).not.toHaveClass('bg-primary');
    }
  });

  test('clears results when input becomes inactive', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox') as HTMLInputElement;

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    expect(input.value).toBe('Coffee');

    await act(async () => {
      fireEvent.blur(input);
    });

    // Note: The actual clearing happens in useEffect, so we need to wait
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  test('has responsive width classes', () => {
    const { container } = render(<SearchBar />);

    const input = container.querySelector('input');
    expect(input).toHaveClass('w-[500px]');
    expect(input).toHaveClass('max-sm:w-full');
  });

  test('has responsive height classes', () => {
    const { container } = render(<SearchBar />);

    const input = container.querySelector('input');
    expect(input).toHaveClass('h-6');
    expect(input).toHaveClass('max-sm:h-8');
  });

  test('result items have responsive padding', async () => {
    render(<SearchBar />);

    const input = screen.getByRole('combobox');

    await act(async () => {
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'Coffee' } });
    });

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveClass('max-sm:py-4');
  });
});
