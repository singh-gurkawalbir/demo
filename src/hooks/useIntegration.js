import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isIntegrationApp } from '../utils/flows';
import { selectors } from '../reducers';

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
  let index = urlExtractFields.findIndex(
    element => element === 'integrations'
  );

  if (index === -1) {
    // for template integrations the url will be ....templates/:templateName/:integrationId/......
    index = urlExtractFields.findIndex(
      element => element === 'templates'
    );
    if (index !== -1) {
      // increase index by 1 to skip templateName
      index += 1;
    }
  }

  return urlExtractFields[index + 1];
};

export default useIntegration;
