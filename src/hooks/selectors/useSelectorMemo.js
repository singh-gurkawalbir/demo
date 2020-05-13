import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export default function useSelectorMemo(selector, ...args) {
  // selector function is expected to be static
  const memoizedSelector = useMemo(() => selector(), [selector]);

  return useSelector(state => memoizedSelector(state, ...args));
}
