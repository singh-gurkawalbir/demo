import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../actions';
import useAllResourceStatus from '../../hooks/useAllResourceStatus';

export default function LoadResources({ children, resources, required }) {
  const dispatch = useDispatch();
  const resourceStatus = useAllResourceStatus(resources);
  const isAllDataReady = resourceStatus.reduce((acc, resourceStatus) => {
    if (!resourceStatus.isReady) {
      return false;
    }

    return acc;
  }, true);

  useEffect(() => {
    if (!isAllDataReady) {
      resourceStatus.forEach(resource => {
        if (!resource.hasData) {
          dispatch(actions.resource.requestCollection(resource.resourceType));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAllDataReady]);

  if (isAllDataReady || !required) {
    return children || null;
  }

  return null;
}
