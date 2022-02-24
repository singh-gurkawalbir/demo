import { useEffect, useRef, useState } from 'react';
import useSyncedRef from './useSyncedRef';

const DEBOUNCE_DURATION = 300;
export default function useDebouncedValue(
  initialValue,
  callback,
  duration = DEBOUNCE_DURATION
) {
  const [input, setInput] = useState(initialValue);
  const memoizedArgsRef = useSyncedRef({
    callback,
    duration,
  });
  const isMountRef = useRef();

  useEffect(() => {
    if (isMountRef?.current) {
      isMountRef.current = false;

      return;
    }
    const { callback, duration } = memoizedArgsRef.current;
    const timer = setTimeout(() => callback(input), duration);

    return () => clearTimeout(timer);
  }, [input, memoizedArgsRef]);

  return [input, setInput];
}
