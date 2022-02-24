import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import useAreResourcesLoaded from '../../hooks/useAreResourcesLoaded';

export default function LoadResources({ children, resources, required }) {
  const dispatch = useDispatch();
  const defaultAShareId = useSelector(state => state?.user?.preferences?.defaultAShareId);
  const { isAllDataReady, resourceStatus } = useAreResourcesLoaded(resources);

  useEffect(() => {
    if (!isAllDataReady) {
      resourceStatus.forEach(resource => {
        if (!resource.hasData) {
          if (resource.resourceType === 'recycleBinTTL' && !defaultAShareId) return;
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
