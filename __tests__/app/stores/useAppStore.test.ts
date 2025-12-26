import { renderHook, act } from '@testing-library/react';
import { useAppStore, openSidebar, closeSidebar } from '@/app/stores/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('initial state', () => {
    test('has correct initial values', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.localeOpen).toBe(false);
      expect(result.current.clickedMore).toBe(false);
    });
  });

  describe('locale state management', () => {
    test('openLocale sets localeOpen to true', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.openLocale();
      });

      expect(result.current.localeOpen).toBe(true);
    });

    test('closeLocale sets localeOpen to false', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.openLocale();
        result.current.closeLocale();
      });

      expect(result.current.localeOpen).toBe(false);
    });

    test('locale can be toggled multiple times', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.openLocale();
      });
      expect(result.current.localeOpen).toBe(true);

      act(() => {
        result.current.closeLocale();
      });
      expect(result.current.localeOpen).toBe(false);

      act(() => {
        result.current.openLocale();
      });
      expect(result.current.localeOpen).toBe(true);
    });
  });

  describe('openMore', () => {
    test('sets clickedMore to true', () => {
      const { result } = renderHook(() => useAppStore());

      // Create mock sidebar element
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-[-120%]', 'opacity-0');
      document.body.appendChild(sidebar);

      act(() => {
        result.current.openMore();
      });

      expect(result.current.clickedMore).toBe(true);
    });

    test('calls openSidebar which manipulates DOM classes', () => {
      const { result } = renderHook(() => useAppStore());

      // Create mock sidebar element
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-[-120%]', 'opacity-0');
      document.body.appendChild(sidebar);

      act(() => {
        result.current.openMore();
      });

      // Check that classes were modified
      expect(sidebar.classList.contains('translate-y-[-120%]')).toBe(false);
      expect(sidebar.classList.contains('opacity-0')).toBe(false);
      expect(sidebar.classList.contains('translate-y-0')).toBe(true);
      expect(sidebar.classList.contains('opacity-100')).toBe(true);
    });

    test('handles missing sidebar element gracefully', () => {
      const { result } = renderHook(() => useAppStore());

      // Don't create sidebar element - should not crash
      expect(() => {
        act(() => {
          result.current.openMore();
        });
      }).not.toThrow();

      expect(result.current.clickedMore).toBe(true);
    });
  });

  describe('closeMore', () => {
    test('sets clickedMore to false', () => {
      const { result } = renderHook(() => useAppStore());

      // Create mock sidebar element
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-0', 'opacity-100');
      document.body.appendChild(sidebar);

      // First open
      act(() => {
        result.current.openMore();
      });

      // Then close
      act(() => {
        result.current.closeMore();
      });

      expect(result.current.clickedMore).toBe(false);
    });

    test('calls closeSidebar which manipulates DOM classes', () => {
      const { result } = renderHook(() => useAppStore());

      // Create mock sidebar element
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-0', 'opacity-100');
      document.body.appendChild(sidebar);

      act(() => {
        result.current.closeMore();
      });

      // Check that classes were modified
      expect(sidebar.classList.contains('translate-y-0')).toBe(false);
      expect(sidebar.classList.contains('opacity-100')).toBe(false);
      expect(sidebar.classList.contains('translate-y-[-120%]')).toBe(true);
      expect(sidebar.classList.contains('optacity-0')).toBe(true); // Note: typo in original code
    });

    test('handles missing sidebar element gracefully', () => {
      const { result } = renderHook(() => useAppStore());

      // Don't create sidebar element - should not crash
      expect(() => {
        act(() => {
          result.current.closeMore();
        });
      }).not.toThrow();

      expect(result.current.clickedMore).toBe(false);
    });
  });

  describe('openSidebar helper function', () => {
    test('removes hide classes and adds show classes', () => {
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-[-120%]', 'opacity-0');
      document.body.appendChild(sidebar);

      openSidebar();

      expect(sidebar.classList.contains('translate-y-[-120%]')).toBe(false);
      expect(sidebar.classList.contains('opacity-0')).toBe(false);
      expect(sidebar.classList.contains('translate-y-0')).toBe(true);
      expect(sidebar.classList.contains('opacity-100')).toBe(true);
    });

    test('does not crash when sidebar element does not exist', () => {
      expect(() => {
        openSidebar();
      }).not.toThrow();
    });
  });

  describe('closeSidebar helper function', () => {
    test('removes show classes and adds hide classes', () => {
      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      sidebar.classList.add('translate-y-0', 'opacity-100');
      document.body.appendChild(sidebar);

      closeSidebar();

      expect(sidebar.classList.contains('translate-y-0')).toBe(false);
      expect(sidebar.classList.contains('opacity-100')).toBe(false);
      expect(sidebar.classList.contains('translate-y-[-120%]')).toBe(true);
      expect(sidebar.classList.contains('optacity-0')).toBe(true); // Note: typo in original code
    });

    test('does not crash when sidebar element does not exist', () => {
      expect(() => {
        closeSidebar();
      }).not.toThrow();
    });
  });

  describe('integration scenarios', () => {
    test('opening and closing sidebar updates both state and DOM', () => {
      const { result } = renderHook(() => useAppStore());

      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      document.body.appendChild(sidebar);

      // Open sidebar
      act(() => {
        result.current.openMore();
      });

      expect(result.current.clickedMore).toBe(true);
      expect(sidebar.classList.contains('translate-y-0')).toBe(true);
      expect(sidebar.classList.contains('opacity-100')).toBe(true);

      // Close sidebar
      act(() => {
        result.current.closeMore();
      });

      expect(result.current.clickedMore).toBe(false);
      expect(sidebar.classList.contains('translate-y-[-120%]')).toBe(true);
    });

    test('locale and sidebar states are independent', () => {
      const { result } = renderHook(() => useAppStore());

      const sidebar = document.createElement('div');
      sidebar.id = 'list-sidebar';
      document.body.appendChild(sidebar);

      act(() => {
        result.current.openLocale();
        result.current.openMore();
      });

      expect(result.current.localeOpen).toBe(true);
      expect(result.current.clickedMore).toBe(true);

      act(() => {
        result.current.closeLocale();
      });

      expect(result.current.localeOpen).toBe(false);
      expect(result.current.clickedMore).toBe(true); // Should remain true

      act(() => {
        result.current.closeMore();
      });

      expect(result.current.localeOpen).toBe(false);
      expect(result.current.clickedMore).toBe(false);
    });
  });
});
