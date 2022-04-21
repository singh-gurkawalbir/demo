import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { useSelectorMemo } from '../../hooks';
import { selectors } from '../../reducers';

export default function LoadResources({ children, resources, required, lazyResources = [], integrationId }) {
  const dispatch = useDispatch();
  const defaultAShareId = useSelector(state => state?.user?.preferences?.defaultAShareId);

  const requiredResources = useMemo(() => typeof resources === 'string'
    ? resources.split(',').map(r => r?.trim())
    : resources,
  [resources]);
  const lazyLoadResources = useMemo(() => typeof lazyResources === 'string'
    ? lazyResources.split(',').map(r => r?.trim())
    : lazyResources,
  [lazyResources]);
  const allResources = useMemo(() => [...requiredResources, ...lazyLoadResources], [requiredResources, lazyLoadResources]);

  const resourceStatus = useSelectorMemo(selectors.mkResourceStatus, allResources, integrationId);
  const isAllDataReady = !resourceStatus.some(resource => !resource.isReady);
  const isAllRequiredDataReady = !resourceStatus.some(resource => !resource.isReady && !lazyLoadResources.includes(resource.resourceType));

  useEffect(() => {
    if (!isAllDataReady) {
      resourceStatus.forEach(resource => {
        if (resource.shouldSendRequest) {
          if (resource.resourceType === 'recycleBinTTL' && !defaultAShareId) return;
          dispatch(actions.resource.requestCollection(resource.resourceType, undefined, undefined, integrationId));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAllDataReady, resources, defaultAShareId]);

  if (isAllRequiredDataReady || !required) {
    return children || null;
  }

  return null;
}
