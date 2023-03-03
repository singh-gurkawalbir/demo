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
  const childName = useSelector(state => selectors.resource(state, 'integrations', childId)?.name);

  if (isIntegrationAppV2) {
    return (
      <LoadResource resourceType="integrations" resourceId={childId}>
        {childName || childId}
      </LoadResource>
    );
  }

  return (
    <LoadResource resourceType="integrations" resourceId={integrationId}>
      {child ? child.label : childId}
    </LoadResource>
  );
};
