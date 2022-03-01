import { useMemo } from 'react';
import useSelectorMemo from './selectors/useSelectorMemo';
import { selectors } from '../reducers';

export default function useAreResourcesLoaded(resources) {
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    resources
  );
  const isAllDataReady = useMemo(
    () =>
      resourceStatus.reduce((acc, resourceStatus) => {
        if (!resourceStatus.isReady) {
          return false;
        }

        return acc;
      }, true),
    [resourceStatus]
  );

  return {isAllDataReady, resourceStatus};
}
