import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';

export default function LoadResources({ children, resources, required }) {
  const dispatch = useDispatch();
  const resourceStatus = useSelector(state => {
    const requiredStatus = (typeof resources === 'string'
      ? resources.split(',')
      : resources
    ).reduce((acc, resourceType) => {
      acc.push(selectors.resourceStatus(state, resourceType.trim()));

      return acc;
    }, []);

    return requiredStatus;
  });
  const isAllDataReady = resourceStatus.reduce((acc, resourceStatus) => {
    if (!resourceStatus.isReady) {
      return false;
    }

    return acc;
  }, true);

  console.log(resources, resourceStatus);

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
