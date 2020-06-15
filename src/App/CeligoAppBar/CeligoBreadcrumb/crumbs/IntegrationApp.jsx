import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const integrationApp = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  return (
    <LoadResources resources="integrations">
      {integrationApp ? integrationApp.name : 'Integration app'}
    </LoadResources>
  );
};

export const StoreCrumb = ({ integrationId, storeId }) => {
  const store = useSelector(state => {
    const integration = selectors.integrationAppSettings(state, integrationId, storeId);
    if (integration && integration.stores) {
      return integration.stores.find(s => s.value === storeId)
    }

    return null;
  }, shallowEqual
  );
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const childName = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', storeId);
    return integration && integration.name;
  })

  if (isFrameWork2) {
    return childName || storeId;
  }

  return (
    <LoadResources resources="integrations">
      {store ? store.label : storeId}
    </LoadResources>
  );
};
