import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function useAllResourceStatus(allResources) {
  // allResources must be memoized or else it does not cache the result
  const memoizedResourceStatusSelector = useMemo(
    () => selectors.makeAllResourceStatusSelector(),
    []
  );

  return useSelector(state =>
    memoizedResourceStatusSelector(state, allResources)
  );
}
