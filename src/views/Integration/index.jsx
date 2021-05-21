import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import LoadResources from '../../components/LoadResources';
import { selectors } from '../../reducers';
import IntegrationApp from './App';
import IntegrationDIY from './DIY';

export default function Integration() {
  const match = useRouteMatch();
  const { integrationId} = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  return (
    <LoadResources required resources="integrations,published" >
      {isIntegrationAppV1
        ? <IntegrationApp />
        : <IntegrationDIY />}
    </LoadResources>
  );
}
