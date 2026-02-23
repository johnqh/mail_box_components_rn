import { cn } from '../lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, 'bar', null)).toBe('foo bar');
  });

  it('handles empty string', () => {
    expect(cn('')).toBe('');
  });

  it('handles no arguments', () => {
    expect(cn()).toBe('');
  });

  it('handles conditional classes via objects', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles mixed arguments', () => {
    expect(cn('base', { active: true, hidden: false }, ['extra'])).toBe(
      'base active extra'
    );
  });

  it('handles false and zero values', () => {
    expect(cn('foo', false, 0, 'bar')).toBe('foo bar');
  });

  it('combines Tailwind-like classes', () => {
    expect(cn('rounded-lg p-4', 'bg-white', 'mt-2')).toBe(
      'rounded-lg p-4 bg-white mt-2'
    );
  });

  it('handles nested arrays', () => {
    expect(cn(['a', ['b', 'c']])).toBe('a b c');
  });
});
