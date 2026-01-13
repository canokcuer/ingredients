import { renderHook, act } from '@testing-library/react';
import useLongPress, { getEventPosition } from '../../src/hooks/useLongPress';

describe('useLongPress hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    navigator.vibrate = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('returns isPressed as false initially', () => {
      const { result } = renderHook(() => useLongPress());
      expect(result.current.isPressed).toBe(false);
    });

    it('returns handlers object with all event handlers', () => {
      const { result } = renderHook(() => useLongPress());
      const { handlers } = result.current;

      expect(handlers.onTouchStart).toBeInstanceOf(Function);
      expect(handlers.onTouchEnd).toBeInstanceOf(Function);
      expect(handlers.onTouchMove).toBeInstanceOf(Function);
      expect(handlers.onTouchCancel).toBeInstanceOf(Function);
      expect(handlers.onMouseDown).toBeInstanceOf(Function);
      expect(handlers.onMouseUp).toBeInstanceOf(Function);
      expect(handlers.onMouseMove).toBeInstanceOf(Function);
      expect(handlers.onMouseLeave).toBeInstanceOf(Function);
    });
  });

  describe('long press detection', () => {
    it('sets isPressed to true after threshold (default 300ms)', () => {
      const { result } = renderHook(() => useLongPress());

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      expect(result.current.isPressed).toBe(false);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(true);
    });

    it('respects custom threshold', () => {
      const { result } = renderHook(() => useLongPress({ threshold: 500 }));

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(false);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.isPressed).toBe(true);
    });

    it('does not trigger for short press', () => {
      const { result } = renderHook(() => useLongPress());

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current.handlers.onMouseUp({ clientX: 100, clientY: 100 });
      });

      expect(result.current.isPressed).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('calls onLongPressStart when threshold is reached', () => {
      const onLongPressStart = jest.fn();
      const { result } = renderHook(() => useLongPress({ onLongPressStart }));

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      expect(onLongPressStart).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(onLongPressStart).toHaveBeenCalledTimes(1);
    });

    it('calls onLongPressEnd when press is released after long press', () => {
      const onLongPressEnd = jest.fn();
      const { result } = renderHook(() => useLongPress({ onLongPressEnd }));

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(onLongPressEnd).not.toHaveBeenCalled();

      act(() => {
        result.current.handlers.onMouseUp({ clientX: 100, clientY: 100 });
      });

      expect(onLongPressEnd).toHaveBeenCalledTimes(1);
    });

    it('calls onPress for short press instead of onLongPressEnd', () => {
      const onPress = jest.fn();
      const onLongPressEnd = jest.fn();
      const { result } = renderHook(() => useLongPress({ onPress, onLongPressEnd }));

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(100);
        result.current.handlers.onMouseUp({ clientX: 100, clientY: 100 });
      });

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(onLongPressEnd).not.toHaveBeenCalled();
    });
  });

  describe('haptic feedback', () => {
    it('triggers vibration on long press', () => {
      const { result } = renderHook(() => useLongPress());

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(navigator.vibrate).toHaveBeenCalledWith(50);
    });
  });

  describe('movement cancellation', () => {
    it('cancels long press when moved beyond threshold', () => {
      const onLongPressStart = jest.fn();
      const { result } = renderHook(() =>
        useLongPress({ onLongPressStart, moveThreshold: 10 })
      );

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      act(() => {
        // Move 15px - beyond threshold
        result.current.handlers.onMouseMove({ clientX: 115, clientY: 100 });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(false);
      expect(onLongPressStart).not.toHaveBeenCalled();
    });

    it('does not cancel when movement is within threshold', () => {
      const onLongPressStart = jest.fn();
      const { result } = renderHook(() =>
        useLongPress({ onLongPressStart, moveThreshold: 10 })
      );

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      act(() => {
        // Move 5px - within threshold
        result.current.handlers.onMouseMove({ clientX: 105, clientY: 100 });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(true);
      expect(onLongPressStart).toHaveBeenCalledTimes(1);
    });

    it('cancels active long press when moving after threshold reached', () => {
      const onLongPressEnd = jest.fn();
      const { result } = renderHook(() =>
        useLongPress({ onLongPressEnd, moveThreshold: 10 })
      );

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(true);

      act(() => {
        result.current.handlers.onMouseMove({ clientX: 120, clientY: 100 });
      });

      expect(result.current.isPressed).toBe(false);
      expect(onLongPressEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('touch events', () => {
    it('handles touch start and end', () => {
      const onLongPressStart = jest.fn();
      const onLongPressEnd = jest.fn();
      const { result } = renderHook(() =>
        useLongPress({ onLongPressStart, onLongPressEnd })
      );

      const touchEvent = {
        touches: [{ clientX: 100, clientY: 100 }]
      };

      act(() => {
        result.current.handlers.onTouchStart(touchEvent);
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(true);
      expect(onLongPressStart).toHaveBeenCalledTimes(1);

      act(() => {
        result.current.handlers.onTouchEnd({
          changedTouches: [{ clientX: 100, clientY: 100 }]
        });
      });

      expect(result.current.isPressed).toBe(false);
      expect(onLongPressEnd).toHaveBeenCalledTimes(1);
    });

    it('cancels on touch cancel', () => {
      const onLongPressStart = jest.fn();
      const { result } = renderHook(() => useLongPress({ onLongPressStart }));

      act(() => {
        result.current.handlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 }]
        });
      });

      act(() => {
        result.current.handlers.onTouchCancel();
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(false);
      expect(onLongPressStart).not.toHaveBeenCalled();
    });

    it('handles touch move for scroll detection', () => {
      const { result } = renderHook(() => useLongPress({ moveThreshold: 10 }));

      act(() => {
        result.current.handlers.onTouchStart({
          touches: [{ clientX: 100, clientY: 100 }]
        });
      });

      // Simulate scroll (large Y movement)
      act(() => {
        result.current.handlers.onTouchMove({
          touches: [{ clientX: 100, clientY: 150 }]
        });
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(false);
    });
  });

  describe('mouse events', () => {
    it('only responds to left mouse button', () => {
      const onLongPressStart = jest.fn();
      const { result } = renderHook(() => useLongPress({ onLongPressStart }));

      // Right click
      act(() => {
        result.current.handlers.onMouseDown({ button: 2, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(onLongPressStart).not.toHaveBeenCalled();

      // Left click
      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(onLongPressStart).toHaveBeenCalledTimes(1);
    });

    it('cancels on mouse leave', () => {
      const onLongPressEnd = jest.fn();
      const { result } = renderHook(() => useLongPress({ onLongPressEnd }));

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
        jest.advanceTimersByTime(300);
      });

      expect(result.current.isPressed).toBe(true);

      act(() => {
        result.current.handlers.onMouseLeave();
      });

      expect(result.current.isPressed).toBe(false);
      expect(onLongPressEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const { result, unmount } = renderHook(() => useLongPress());

      act(() => {
        result.current.handlers.onMouseDown({ button: 0, clientX: 100, clientY: 100 });
      });

      // Unmount before timer fires
      unmount();

      // This should not throw or cause issues
      act(() => {
        jest.advanceTimersByTime(300);
      });
    });
  });
});

describe('getEventPosition helper', () => {
  it('extracts position from touch event', () => {
    const touchEvent = {
      touches: [{ clientX: 50, clientY: 75 }]
    };
    const pos = getEventPosition(touchEvent);
    expect(pos).toEqual({ x: 50, y: 75 });
  });

  it('extracts position from changedTouches', () => {
    const touchEndEvent = {
      changedTouches: [{ clientX: 60, clientY: 80 }]
    };
    const pos = getEventPosition(touchEndEvent);
    expect(pos).toEqual({ x: 60, y: 80 });
  });

  it('extracts position from mouse event', () => {
    const mouseEvent = { clientX: 100, clientY: 200 };
    const pos = getEventPosition(mouseEvent);
    expect(pos).toEqual({ x: 100, y: 200 });
  });

  it('returns zero for missing coordinates', () => {
    const pos = getEventPosition({});
    expect(pos).toEqual({ x: 0, y: 0 });
  });
});
