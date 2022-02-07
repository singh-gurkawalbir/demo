import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';

const DEBOUNCE_DURATION = 300;
export default function useDebouncedValue(
  initialValue,
  callback,
  duration = DEBOUNCE_DURATION
) {
  const [input, setInput] = useState(initialValue);
  const memoizedArgsRef = useRef({
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

    if (typeof callback === 'function') {
      const debouncedCallback = debounce(() => callback(input), duration);

      debouncedCallback();
    }
  }, [input]);

  return [input, setInput];
}
