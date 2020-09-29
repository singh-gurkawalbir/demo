import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../reducers';
import IntegrationApp from './App';
import IntegrationDIY from './DIY';

export default function Integration() {
  const match = useRouteMatch();
  const { integrationId} = match.params;
  const isIntegrationApp = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', integrationId);

    return !!(integration && integration._connectorId);
  });
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId, true));

  return isIntegrationApp && !isFrameWork2
    ? <IntegrationApp />
    : <IntegrationDIY />;
}
