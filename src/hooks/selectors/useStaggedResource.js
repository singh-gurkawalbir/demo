import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function useResourceData(resourceType, id, scope) {
  // resourceType,id,scope must be memoized or else it does not cache the result
  const memoizedResourceData = useMemo(
    () => selectors.makeResourceDataSelector(),
    []
  );

  return useSelector(state =>
    memoizedResourceData(state, resourceType, id, scope)
  );
}
