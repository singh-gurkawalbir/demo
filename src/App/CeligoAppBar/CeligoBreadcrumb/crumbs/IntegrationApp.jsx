import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const integrationAppName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name || 'Integration app'
  );
  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  return (
    <LoadResources integrationId={integrationId} resources={isIntegrationAppV2 ? 'integrations' : ''}>
      {integrationAppName}
    </LoadResources>
  );
};

export const ChildCrumb = ({ integrationId, childId }) => {
  const iaSettings = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const child = iaSettings?.children?.find(c => c?.value === childId);

  const isIntegrationAppV2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));
  const childName = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', childId);

    return integration && integration.name;
  });

  if (isIntegrationAppV2) {
    return childName || childId;
  }

  return (
    <LoadResources integrationId={childId} resources={isIntegrationAppV2 ? 'integrations' : ''}>
      {child ? child.label : childId}
    </LoadResources>
  );
};
