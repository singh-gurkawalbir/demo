import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import Spinner from '../../components/Spinner';
import { selectors } from '../../reducers';
import IntegrationApp from './App';
import IntegrationDIY from './DIY';

export default function Integration() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { integrationId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));
  const dependenciesResolved = useSelector(state => selectors.resolvedIntegrationDependencies(state, integrationId));

  useEffect(() => {
    dispatch(actions.resource.integrations.fetchIfAnyUnloadedFlows(integrationId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!dependenciesResolved) {
    return <Spinner centerAll loading size="large" />;
  }

  return (
    <LoadResources required resources="integrations,published" >
      {isIntegrationAppV1
        ? <IntegrationApp />
        : <IntegrationDIY />}
    </LoadResources>
  );
}
