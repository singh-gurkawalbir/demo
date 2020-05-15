import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isIntegrationApp } from '../utils/flows';
import * as selectors from '../reducers';

// returns integrationId of the resource
const useIntegration = (resourceType, resourceId) => {
  const history = useHistory();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  if (resourceType === 'integrations') {
    return resourceId;
  }

  const isIAResource = isIntegrationApp(resource);

  if (isIAResource || resourceType === 'flows') {
    return resource._integrationId;
  }

  const url = history.location.pathname;
  const urlExtractFields = url.split('/');
  // TODO: find a better way, prone to errors
  const index = urlExtractFields.findIndex(
    element => element === 'integrations'
  );

  if (index === -1) {
    return undefined;
  }

  return urlExtractFields[index + 1];
};

export default useIntegration;
