import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import LoadResources from '../../../../../components/SuiteScript/LoadResources';

export default function IntegrationCrumb({ ssLinkedConnectionId, integrationId }) {
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {ssLinkedConnectionId, resourceType: 'integrations', id: integrationId})
  );

  return (
    <LoadResources ssLinkedConnectionId={ssLinkedConnectionId} resources="tiles">
      {integration ? integration.displayName : 'Integration'}
    </LoadResources>
  );
}
