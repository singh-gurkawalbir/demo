import React, {useCallback} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import LoadResources from '../../../../components/LoadResources';
import getRoutePath from '../../../../utils/routePaths';

export default function CloneCrumb({ resourceId, resourceType }) {
  const history = useHistory();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  let path = 'goBack';

  switch (resourceType) {
    case 'integrations':
      path = getRoutePath(`/integrations/${resourceId}`);
      break;
    case 'flows':
      if (resource) {
        path = resource._integrationId ? getRoutePath(`/integrations/${resource._integrationId}/flowBuilder/${resourceId}`) : getRoutePath(`/integrations/none/flowBuilder/${resourceId}`);
      }
      break;
    case 'exports':
      path = getRoutePath(`/exports/edit/exports/${resourceId}`);
      break;
    case 'imports':
      path = getRoutePath(`/imports/edit/imports/${resourceId}`);
      break;
    default: break;
  }

  const handleClick = useCallback(e => {
    e.preventDefault();
    e.stopPropagation();

    if (path === 'goBack') {
      history.goBack();
    } else {
      history.push(path);
    }
  }, [history, path]);

  return (
    <LoadResources resources={resourceType}>
      <a color="inherit" href={path}>
        <span onClick={handleClick}>
          {resource?.name ? resource.name : MODEL_PLURAL_TO_LABEL[resourceType]}
        </span>
      </a>
    </LoadResources>
  );
}
