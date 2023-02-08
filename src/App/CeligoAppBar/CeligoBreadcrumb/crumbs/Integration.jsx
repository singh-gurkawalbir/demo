import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';

export default function IntegrationCrumb({ integrationId }) {
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId),
  shallowEqual
  );

  if (integrationId === 'none') {
    return 'Standalone flows';
  }

  // we dont want to "require" integrations resources to be loaded to prevent
  // the UI from appearing slow... just default the name to a const if no
  // integration -yet- exists in the state.
  return (
    <LoadResources integrationId={integrationId}>
      {integration ? integration.name : 'Integration'}
    </LoadResources>
  );
}
