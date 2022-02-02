import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../reducers';

export default function LoadResources({ children, resources, required }) {
  const dispatch = useDispatch();
  const defaultAShareId = useSelector(state => state?.user?.preferences?.defaultAShareId);
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

  useEffect(() => {
    if (!isAllDataReady && defaultAShareId) {
      resourceStatus.forEach(resource => {
        if (!resource.hasData) {
          dispatch(actions.resource.requestCollection(resource.resourceType));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAllDataReady, resources]);

  if (isAllDataReady || !required) {
    return children || null;
  }

  return null;
}
