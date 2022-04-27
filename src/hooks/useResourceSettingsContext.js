import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../reducers';
import { isIntegrationAppVersion2 } from '../utils/integrationApps';
import { STANDALONE_INTEGRATION } from '../utils/constants';

// returns context of the resource
export default function useResourceSettingsContext(resourceType, resourceId, integrationId) {
  const history = useHistory();
  const isIntegrationV2 = useSelector(state =>
    isIntegrationAppVersion2(selectors.resource(state, 'integrations', integrationId), true)
  );
  const resourceContext = {
    type: 'settings',
  };

  if (!integrationId || integrationId === STANDALONE_INTEGRATION.id) {
    return {};
  }

  const url = history.location.pathname;
  const urlExtractFields = url.split('/');

  const childintegrationIndex = isIntegrationV2 ? urlExtractFields.findIndex(
    element => element === 'child'
  ) : -1;

  if (childintegrationIndex === -1) {
    resourceContext._integrationId = integrationId;
  } else {
    resourceContext._parentIntegrationId = integrationId;
    resourceContext._integrationId = urlExtractFields[childintegrationIndex + 1];
  }

  if (resourceType === 'integrations') {
    return {
      container: 'integration',
      ...resourceContext,
    };
  }

  if (resourceType === 'flows') {
    return {
      container: 'flow',
      _flowId: resourceId,
      ...resourceContext,
    };
  }

  const flowindex = urlExtractFields.findIndex(
    element => element === 'flowBuilder' || element === 'dataLoader'
  );

  if (flowindex !== -1) {
    resourceContext._flowId = urlExtractFields[flowindex + 1];
  }

  if (resourceType === 'imports') {
    return {
      container: 'import',
      _importId: resourceId,
      ...resourceContext,
    };
  }

  if (resourceType === 'exports') {
    return {
      container: 'export',
      _exportId: resourceId,
      ...resourceContext,
    };
  }
}
