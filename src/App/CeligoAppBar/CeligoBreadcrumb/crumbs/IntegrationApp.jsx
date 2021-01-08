import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const integrationAppName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name || 'Integration app'
  );

  return (
    <LoadResources resources="integrations">
      {integrationAppName}
    </LoadResources>
  );
};

export const StoreCrumb = ({ integrationId, storeId }) => {
  const iaSettings = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const store = iaSettings?.stores?.find(s => s?.value === storeId);

  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const childName = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', storeId);

    return integration && integration.name;
  });

  if (isFrameWork2) {
    return childName || storeId;
  }

  return (
    <LoadResources resources="integrations">
      {store ? store.label : storeId}
    </LoadResources>
  );
};
