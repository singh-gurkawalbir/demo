import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import * as selectors from '../../reducers';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import LoadResources from '../../components/LoadResources';

export default function AmpersandRoutesHandler({ match }) {
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
    case '/pg/flows/create':
    case '/pg/orchestrations/create':
    case '/pg/flow-builder/v1_5/create':
      return <Redirect
        to={`/pg/integrations/none/flowBuilder/new-${shortid.generate()}`}
      />;
    case '/pg/integrations/create':
      return <Redirect
        to={`/pg/dashboard/add/integrations/new-${shortid.generate()}`}
      />;
    case '/pg/:resourceType/create':
      return <Redirect
        to={`/pg/${match.params.resourceType}/add/${match.params.resourceType}/new-${shortid.generate()}`}
      />;
    case '/pg/:resourceType/:resourceId/edit':
      return <Redirect
        to={`/pg/${match.params.resourceType}/edit/${match.params.resourceType}/${match.params.connectorId}`}
        />;
    case '/pg/data-loader':
      return <Redirect
        to={`/pg/integrations/none/dataLoader/new-${shortid.generate()}`}
      />;
    case '/pg/integrations/:integrationId/data-loader':
      return <Redirect
        to={`/pg/integrations/${integrationId}/dataLoader/new-${shortid.generate()}`}
      />;
    case '/pg/integrations/:integrationId/data-loader/:flowId/edit':
      return <Redirect
        to={`/pg/integrations/${match.params.integrationId}/dataLoader/${match.params.flowId}}`}
      />;
    case '/pg/integrations/:integrationId/flow-builder/v1_5/:flowId/create':
    case '/pg/integrations/:integrationId/flows/:flowId/edit':
    case '/pg/integrations/:integrationId/flow-builder/v1_5/:flowId/edit':
    case '/pg/integrations/:integrationId/orchestrations/:flowId/edit':
    case '/pg/integrations/:integrationId/orchestrations/:flowId/exports/create':
      return <Redirect
        to={`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}`}
      />;
    case '/pg/integrations/:integrationId/orchestrations/:flowId/:resourceType/create':
      return <Redirect
        to={`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/add/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/new=${shortid.generate()}`}
    />;
    case '/pg/integrations/:integrationId/orchestrations/:flowId/:resourceType/:resourceId/edit':
      return <Redirect
        to={`/pg/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/edit/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/${match.params.resourceId}`}
    />;
    case '/pg/integrations/:integrationId/flows/create':
    case '/pg/integrations/:_integrationId/orchestrations/create':
    case '/pg/integrations/:integrationId/flow-builder/v1_5/create':
      return <Redirect
        to={`/pg/integrations/${match.params.integrationId}/flowBuilder/new-${shortid.generate()}`}
      />;
    case '/pg/connectors/:connectorId/licenses':
      return <Redirect
        to={`/pg/connectors/${match.params.connectorId}/connectorLicenses`}
      />;
    case '/pg/connectors/:connectorId/licenses/create':
      return <Redirect
        to={`/pg/connectors/${match.params.connectorId}/connectorLicenses/add/connectorLicenses/new-${shortid.generate()}`}
      />;
    case '/pg/connectors/:connectorId/licenses/:licenseId/edit':
      return <Redirect
        to={`/pg/connectors/${match.params.connectorId}/connectorLicenses/edit/connectorLicenses/${match.params.licenseId}`}
      />;
    case '/pg/clone/integrations/:_integrationId/:resourceType/:resourceId/preview':
      return <Redirect
        to={`/pg/clone/${match.params.resourceType}/${match.params.resourceId}/preview`}
        />;
    case '/pg/clone/integrations/:_integrationId/:resourceType/:resourceId/setup':
      return <Redirect
        to={`/pg/clone/${match.params.resourceType}/${match.params.resourceId}/setup`}
      />;
    case '/pg/my-account/audit-log':
      return <Redirect
        to="/pg/myAccount/audit"
      />;
    case '/pg/my-account':
    case '/pg/my-account/:section':
      return <Redirect
        to={`/pg/myAccount/${match.params.section || 'profile'}`}
      />;
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
