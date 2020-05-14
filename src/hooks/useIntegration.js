import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isConnector } from '../utils/flows';
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

  const isConnectorResource = isConnector(resource);

  if (isConnectorResource || resourceType === 'flows') {
    return resource._integrationId;
  }

  const url = history.location.pathname;
  const urlExtractFields = url.split('/');

  // TODO: find a better way, prone to errors
  if (urlExtractFields[2] !== 'integrations') {
    return undefined;
  }

  return urlExtractFields[3];
};

export default useIntegration;
