import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import * as selectors from '../../reducers';
import IntegrationApp from './App';
import IntegrationDIY from './DIY';

export default function Integration() {
  const match = useRouteMatch()
  const { integrationId, storeId } = match.params;
  const isFrameWork2 = useSelector(state => selectors.isIntegrationAppVersion2(state, integrationId));
  return isFrameWork2 ?
    <IntegrationDIY match={match} {...match.params} childId={storeId} /> :
    <IntegrationApp match={match} {...match.params} />
}
