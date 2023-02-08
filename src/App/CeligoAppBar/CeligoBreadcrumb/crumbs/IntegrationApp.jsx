import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResource from '../../../../components/LoadResource';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

export const IntegrationAppCrumb = ({ integrationId }) => {
  const integrationAppName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name || 'Integration app'
  );

  return (
    <LoadResource resourceType="integrations" resourceId={integrationId}>
      {integrationAppName}
    </LoadResource>
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
    <LoadResource resourceType="integrations" resourceId={childId}>
      {child ? child.label : childId}
    </LoadResource>
  );
};
