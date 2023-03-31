import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import LoadResource from '../../../../components/LoadResource';

export default function IntegrationCrumb({ integrationId }) {
  const integrationName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name,
  );

  if (integrationId === 'none') {
    return 'Standalone flows';
  }

  // we dont want to "require" integrations resources to be loaded to prevent
  // the UI from appearing slow... just default the name to a const if no
  // integration -yet- exists in the state.
  return (
    <LoadResource resourceType="integrations" resourceId={integrationId}>
      {integrationName || 'Integration'}
    </LoadResource>
  );
}
