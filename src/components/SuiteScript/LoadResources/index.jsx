import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import rfdc from 'rfdc';
import actions from '../../../actions';
import { selectors } from '../../../reducers';

const clone = rfdc({proto: true});

export default function LoadResources({
  children,
  ssLinkedConnectionId,
  integrationId,
  resources,
  required,
}) {
  const dispatch = useDispatch();
  const resourceStatus = useSelector(state => {
    const requiredStatus = (typeof resources === 'string'
      ? resources.split(',')
      : resources
    ).reduce((acc, resourceType) => {
      acc.push(
        selectors.suiteScriptResourceStatus(state, {
          ssLinkedConnectionId,
          integrationId:
            resourceType.trim() === 'flows' ? integrationId : undefined,
          resourceType: resourceType.trim(),
        })
      );

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

  useEffect(() => {
    if (!isAllDataReady) {
      clone(resourceStatus).forEach(resource => {
        if (!resource.hasData) {
          let path = `suitescript/connections/${ssLinkedConnectionId}/`;

          if (resource.resourceType === 'flows') {
            path += `integrations/${integrationId}/flows`;
          } else if (resource.resourceType === 'nextFlows') {
            path += 'flows';
          } else {
            path += `${resource.resourceType}`;
          }

          dispatch(actions.resource.requestCollection(path));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAllDataReady]);

  if (isAllDataReady || !required) {
    return children;
  }

  return null;
}
