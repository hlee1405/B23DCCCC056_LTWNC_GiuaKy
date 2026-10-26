import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Custom Hook Tests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('Nên trì hoãn cập nhật giá trị sau đúng khoảng thời gian delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'react', delay: 300 },
      }
    );

    expect(result.current).toBe('react');

    rerender({ value: 'react typescript', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('react');

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe('react typescript');
  });

  it('Nên reset timer nếu giá trị thay đổi liên tục trước khi hết thời gian debounce', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce<string>(value, delay),
      {
        initialProps: { value: 'a', delay: 300 },
      }
    );

    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'ab', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(100);
    });
    rerender({ value: 'abc', delay: 300 });

    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('abc');
  });
});
