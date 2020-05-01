import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function useResourceList(filterConfig) {
  // filterConfig must be memoized or else it does not cache the result
  const memoizedResourceList = useMemo(
    () => selectors.makeResourceListSelector(),
    []
  );

  return useSelector(state => memoizedResourceList(state, filterConfig));
}
