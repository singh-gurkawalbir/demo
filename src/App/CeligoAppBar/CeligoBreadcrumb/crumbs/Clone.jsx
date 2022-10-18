import React, {useCallback} from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import LoadResources from '../../../../components/LoadResources';
import getRoutePath from '../../../../utils/routePaths';

export default function CloneCrumb({ resourceId, resourceType }) {
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  const history = useHistory();

  let path;

  switch (resourceType) {
    case 'integrations':
      path = getRoutePath(`/integrations/${resourceId}`);
      break;
    case 'flows':
      if (resource._integrationId) {
        path = resource ? getRoutePath(`/integrations/${resource._integrationId}/flowBuilder/${resourceId}`) : 'goBack';
      } else { path = resource ? getRoutePath(`/integrations/none/flowBuilder/${resourceId}`) : 'goBack'; }
      break;
    case 'exports':
      path = getRoutePath(`/exports/edit/exports/${resourceId}`);
      break;
    case 'imports':
      path = getRoutePath(`/imports/edit/imports/${resourceId}`);
      break;
    default: path = 'goBack';
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
      <span onClick={handleClick}>
        {resource ? resource.name : MODEL_PLURAL_TO_LABEL[resourceType]}
      </span>
    </LoadResources>
  );
}
