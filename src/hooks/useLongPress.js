import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useLongPress - Custom hook for detecting press-and-hold gestures
 *
 * Supports both touch (mobile) and mouse (desktop) interactions.
 * Cancels the gesture if the user scrolls or moves significantly.
 *
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Time in ms before press is considered "long" (default: 300)
 * @param {number} options.moveThreshold - Pixel distance before canceling (default: 10)
 * @param {Function} options.onLongPressStart - Callback when long press starts
 * @param {Function} options.onLongPressEnd - Callback when long press ends
 * @param {Function} options.onPress - Callback for regular (short) press
 * @returns {Object} { isPressed, handlers }
 */
function useLongPress({
  threshold = 300,
  moveThreshold = 10,
  onLongPressStart,
  onLongPressEnd,
  onPress
} = {}) {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Start the press detection
  const start = useCallback((event) => {
    // Get initial position
    const pos = getEventPosition(event);
    startPosRef.current = pos;
    isLongPressRef.current = false;

    // Start timer for long press detection
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsPressed(true);

      // Trigger haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      if (onLongPressStart) {
        onLongPressStart(event);
      }
    }, threshold);
  }, [threshold, onLongPressStart]);

  // End the press
  const end = useCallback((event) => {
    // Clear the timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Handle end based on whether it was a long press
    if (isLongPressRef.current) {
      setIsPressed(false);
      if (onLongPressEnd) {
        onLongPressEnd(event);
      }
    } else if (onPress) {
      // It was a short press/tap
      onPress(event);
    }

    isLongPressRef.current = false;
  }, [onLongPressEnd, onPress]);

  // Cancel the press (e.g., on scroll)
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isLongPressRef.current) {
      setIsPressed(false);
      if (onLongPressEnd) {
        onLongPressEnd();
      }
    }

    isLongPressRef.current = false;
  }, [onLongPressEnd]);

  // Handle movement - cancel if moved too far
  const move = useCallback((event) => {
    if (!timerRef.current && !isLongPressRef.current) {
      return;
    }

    const pos = getEventPosition(event);
    const deltaX = Math.abs(pos.x - startPosRef.current.x);
    const deltaY = Math.abs(pos.y - startPosRef.current.y);

    // If moved beyond threshold, cancel the long press
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      cancel();
    }
  }, [moveThreshold, cancel]);

  // Touch event handlers
  const onTouchStart = useCallback((event) => {
    start(event);
  }, [start]);

  const onTouchEnd = useCallback((event) => {
    end(event);
  }, [end]);

  const onTouchMove = useCallback((event) => {
    move(event);
  }, [move]);

  const onTouchCancel = useCallback(() => {
    cancel();
  }, [cancel]);

  // Mouse event handlers
  const onMouseDown = useCallback((event) => {
    // Only handle left mouse button
    if (event.button !== 0) return;
    start(event);
  }, [start]);

  const onMouseUp = useCallback((event) => {
    end(event);
  }, [end]);

  const onMouseMove = useCallback((event) => {
    move(event);
  }, [move]);

  const onMouseLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  // Combined handlers object
  const handlers = {
    // Touch events (mobile)
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    onTouchCancel,
    // Mouse events (desktop)
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave
  };

  return {
    isPressed,
    handlers
  };
}

/**
 * Helper to get position from touch or mouse event
 */
function getEventPosition(event) {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }

  if (event.changedTouches && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY
    };
  }

  return {
    x: event.clientX || 0,
    y: event.clientY || 0
  };
}

export default useLongPress;
export { getEventPosition };
