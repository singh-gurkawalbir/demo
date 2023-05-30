import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
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
  const { integrationId } = match.params;
  const isIntegrationAppV1 = useSelector(state => selectors.isIntegrationAppV1(state, integrationId));

  // console.log(isIntegrationAppV1);

  return (
    <LoadResources required integrationId={integrationId} resources="published,flows,connections,exports,imports" >
      {isIntegrationAppV1
        ? <IntegrationApp />
        : <IntegrationDIY integrationId={integrationId} />}
    </LoadResources>
  );
}
