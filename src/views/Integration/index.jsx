import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import { selectors } from '../../reducers';
import loadable from '../../utils/loadable';
import retry from '../../utils/retry';

const IntegrationApp = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationApp2' */ './App'))
);
const IntegrationDIY = loadable(() =>
  retry(() => import(/* webpackChunkName: 'IntegrationDIY' */ './DIY'))
);

export default function Integration() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { integrationId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  useEffect(() => {
    dispatch(actions.resource.integrations.fetchIfAnyUnloadedFlows(integrationId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadResources required resources="integrations,published" >
      {isIntegrationAppV1
        ? <IntegrationApp />
        : <IntegrationDIY />}
    </LoadResources>
  );
}
