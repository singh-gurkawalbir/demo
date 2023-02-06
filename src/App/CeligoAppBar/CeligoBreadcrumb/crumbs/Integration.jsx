import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export default function IntegrationCrumb({ integrationId }) {
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  if (integrationId === 'none') {
    return 'Standalone flows';
  }

  // we dont want to "require" integrations resources to be loaded to prevent
  // the UI from appearing slow... just default the name to a const if no
  // integration -yet- exists in the state.
  return (
    <LoadResources integrationId={integrationId} resources="integrations">
      {integration ? integration.name : 'Integration'}
    </LoadResources>
  );
}
