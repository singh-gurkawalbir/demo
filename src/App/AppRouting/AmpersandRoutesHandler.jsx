import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import LoadResources from '../../components/LoadResources';

export default function AmpersandRoutesHandler({match}) {
  const {
    integrationId,
    flowId,
    accessTokenAction,
    accessTokenId
  } = match.params;
  const integrationName = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)?.name
  );
  const childId = useSelector(state =>
    selectors.integrationAppChildIdOfFlow(state, integrationId, flowId)
  );
  const integrationAppName = getIntegrationAppUrlName(integrationName);

  if (integrationId && !integrationName) {
    return <LoadResources required resources="integrations,flows" />;
  }

  switch (match.path) {
    case '/pg/connectors/:integrationId/add-new-store-for-connector':
      return <Redirect
        to={`/pg/integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`}
      />;
    case '/pg/connectors/:integrationId/settings':
      return <Redirect
        to={`/pg/integrationapps/${integrationAppName}/${integrationId}/flows`}
      />;
    case '/pg/connectors/:integrationId/setup':
      return <Redirect
        to={`/pg/integrationapps/${integrationAppName}/${integrationId}/setup`}
      />;
    case '/pg/connectors/:integrationId/settings/tokens/:accessTokenId/:accessTokenAction':
      if (accessTokenAction === 'audit') {
        return <Redirect
          to={`/pg/integrationapps/${integrationAppName}/${integrationId}/flows`}
      />;
      }
      return <Redirect
        to={`/pg/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/admin/apitoken/edit/accesstokens/${accessTokenId}`}
      />;

    case '/pg/connectors/:integrationId/flows/:flowId/mapping':
      if (childId) {
        return <Redirect
          to={`/pg/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/flows/Product/${flowId}/utilityMapping/commonAttributes`}
         />;
      }
      return <Redirect
        to={`/pg/integrationapps/${integrationAppName}/${integrationId}/flows`}
      />;

    default:
      return <Redirect to="/pg/dashboard" />;
  }
}
