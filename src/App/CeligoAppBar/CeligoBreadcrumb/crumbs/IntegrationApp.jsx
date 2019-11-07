import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const integrationApp = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  return (
    <LoadResources resources="integrations">
      {integrationApp ? integrationApp.name : 'Integration App'}
    </LoadResources>
  );
};

export const StoreCrumb = ({ integrationId, storeId }) => {
  const integrationResource = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId, storeId)
  );

  if (
    isEmpty(integrationResource) ||
    (integrationResource.settings &&
      !integrationResource.settings.supportsMultiStore)
  ) {
    return storeId;
  }

  const store = integrationResource.stores.find(s => s.value === storeId);

  return (
    <LoadResources resources="integrations">
      {store ? store.label : storeId}
    </LoadResources>
  );
};
