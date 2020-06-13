import React from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import LoadResources from '../../../../components/SuiteScript/LoadResources';

export default function IntegrationCrumb({ ssLinkedConnectionId, integrationId }) {
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {ssLinkedConnectionId, resourceType: 'integrations', id: integrationId})
  );

  // we dont want to "require" integrations resources to be loaded to prevent
  // the UI from appearing slow... just default the name to a const if no
  // integration -yet- exists in the state.
  return (
    <LoadResources ssLinkedConnectionId={ssLinkedConnectionId} resources="integrations">
      {integration ? integration.displayName : 'Integration'}
    </LoadResources>
  );
}
