import { cn } from '@/app/utils/cn';

describe('cn utility', () => {
  test('merges single class name', () => {
    const result = cn('foo');
    expect(result).toBe('foo');
  });

  test('merges multiple class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  test('handles conditional class names with object syntax', () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toBe('foo baz');
  });

  test('handles array of class names', () => {
    const result = cn(['foo', 'bar', 'baz']);
    expect(result).toBe('foo bar baz');
  });

  test('merges tailwind classes correctly (deduplication)', () => {
    const result = cn('p-4 p-2');
    // twMerge should deduplicate conflicting classes
    expect(result).toBe('p-2');
  });

  test('handles conflicting tailwind classes', () => {
    const result = cn('text-red-500 text-blue-500');
    // Last one wins
    expect(result).toBe('text-blue-500');
  });

  test('handles mixed syntax', () => {
    const result = cn('foo', { bar: true, baz: false }, ['qux']);
    expect(result).toBe('foo bar qux');
  });

  test('handles undefined and null values', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });

  test('handles empty strings', () => {
    const result = cn('foo', '', 'bar');
    expect(result).toBe('foo bar');
  });

  test('handles false boolean values', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  test('merges complex tailwind utilities', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  test('handles nested arrays', () => {
    const result = cn(['foo', ['bar', 'baz']]);
    expect(result).toBe('foo bar baz');
  });

  test('handles object with multiple conditions', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn({
      'bg-primary': isActive,
      'bg-gray-300': !isActive,
      'opacity-50': isDisabled,
      'cursor-pointer': !isDisabled,
    });
    expect(result).toBe('bg-primary cursor-pointer');
  });

  test('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  test('handles whitespace normalization', () => {
    const result = cn('  foo   bar  ', 'baz  ');
    expect(result).toBe('foo bar baz');
  });

  test('real-world example: button variants', () => {
    const variant = 'primary';
    const size = 'large';
    const disabled = false;

    const result = cn(
      'rounded px-4 py-2',
      {
        'bg-primary text-white': variant === 'primary',
        'bg-gray-200 text-black': variant === 'secondary',
      },
      {
        'text-sm': size === 'small',
        'text-base': size === 'medium',
        'text-lg': size === 'large',
      },
      {
        'opacity-50 cursor-not-allowed': disabled,
        'hover:bg-red-700 cursor-pointer': !disabled,
      }
    );

    expect(result).toContain('rounded');
    expect(result).toContain('bg-primary');
    expect(result).toContain('text-lg');
    expect(result).toContain('cursor-pointer');
  });

  test('real-world example: responsive classes', () => {
    const result = cn(
      'w-full',
      'md:w-1/2',
      'lg:w-1/3',
      'xl:w-1/4'
    );

    expect(result).toBe('w-full md:w-1/2 lg:w-1/3 xl:w-1/4');
  });

  test('handles duplicate classes in same string', () => {
    // Note: clsx doesn't deduplicate within same string, only across arguments
    const result = cn('foo foo bar bar');
    // clsx will preserve duplicates in a single string
    expect(result).toContain('foo');
    expect(result).toContain('bar');
  });

  test('merges bg color utilities correctly', () => {
    const result = cn('bg-red-500 hover:bg-red-700', 'bg-blue-500');
    expect(result).toBe('hover:bg-red-700 bg-blue-500');
  });

  test('preserves important modifier', () => {
    const result = cn('text-red-500', '!text-blue-500');
    expect(result).toContain('!text-blue-500');
  });
});
