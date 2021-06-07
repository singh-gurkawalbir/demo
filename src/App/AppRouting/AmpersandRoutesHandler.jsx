import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import shortid from 'shortid';
import { selectors } from '../../reducers';
import { getIntegrationAppUrlName } from '../../utils/integrationApps';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';

export default function AmpersandRoutesHandler({ match }) {
  const {
    integrationId,
    flowId,
    accessTokenAction,
    accessTokenId,
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
    case getRoutePath('/flows/create'):
    case getRoutePath('/orchestrations/create'):
    case getRoutePath('/flow-builder/v1_5/create'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/none/flowBuilder/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/integrations/create'):
      return (
        <Redirect
          to={getRoutePath(`/home/add/integrations/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/:resourceType/create'):
      return (
        <Redirect
          to={getRoutePath(`/${match.params.resourceType}/add/${match.params.resourceType}/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/:resourceType/:resourceId/edit'):
      return (
        <Redirect
          to={getRoutePath(`/${match.params.resourceType}/edit/${match.params.resourceType}/${match.params.connectorId}`)}
        />
      );
    case getRoutePath('/data-loader'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/none/dataLoader/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/integrations/:integrationId/data-loader'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${integrationId}/dataLoader/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/integrations/:integrationId/data-loader/:flowId/edit'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${match.params.integrationId}/dataLoader/${match.params.flowId}}`)}
      />
      );
    case getRoutePath('/integrations/:integrationId/flow-builder/v1_5/:flowId/create'):
    case getRoutePath('/integrations/:integrationId/flows/:flowId/edit'):
    case getRoutePath('/integrations/:integrationId/flow-builder/v1_5/:flowId/edit'):
    case getRoutePath('/integrations/:integrationId/orchestrations/:flowId/edit'):
    case getRoutePath('/integrations/:integrationId/orchestrations/:flowId/exports/create'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}`)}
      />
      );
    case getRoutePath('/integrations/:integrationId/orchestrations/:flowId/:resourceType/create'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/add/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/new=${shortid.generate()}`)}
    />
      );
    case getRoutePath('/integrations/:integrationId/orchestrations/:flowId/:resourceType/:resourceId/edit'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${match.params.integrationId}/flowBuilder/${match.params.flowId}}/edit/${match.params.resourceType === 'exports' ? 'pageGenerator' : 'pageProcessor'}/${match.params.resourceId}`)}
    />
      );
    case getRoutePath('/integrations/:integrationId/flows/create'):
    case getRoutePath('/integrations/:_integrationId/orchestrations/create'):
    case getRoutePath('/integrations/:integrationId/flow-builder/v1_5/create'):
      return (
        <Redirect
          to={getRoutePath(`/integrations/${match.params.integrationId}/flowBuilder/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/connectors/:connectorId/licenses'):
      return (
        <Redirect
          to={getRoutePath(`/connectors/${match.params.connectorId}/connectorLicenses`)}
      />
      );
    case getRoutePath('/connectors/:connectorId/licenses/create'):
      return (
        <Redirect
          to={getRoutePath(`/connectors/${match.params.connectorId}/connectorLicenses/add/connectorLicenses/new-${shortid.generate()}`)}
      />
      );
    case getRoutePath('/connectors/:connectorId/licenses/:licenseId/edit'):
      return (
        <Redirect
          to={getRoutePath(`/connectors/${match.params.connectorId}/connectorLicenses/edit/connectorLicenses/${match.params.licenseId}`)}
      />
      );
    case getRoutePath('/clone/integrations/:_integrationId/:resourceType/:resourceId/preview'):
      return (
        <Redirect
          to={getRoutePath(`/clone/${match.params.resourceType}/${match.params.resourceId}/preview`)}
        />
      );
    case getRoutePath('/clone/integrations/:_integrationId/:resourceType/:resourceId/setup'):
      return (
        <Redirect
          to={getRoutePath(`/clone/${match.params.resourceType}/${match.params.resourceId}/setup`)}
      />
      );
    case getRoutePath('/my-account/audit-log'):
      return (
        <Redirect
          to={getRoutePath('/myAccount/audit')}
      />
      );
    case getRoutePath('/my-account'):
    case getRoutePath('/my-account/:section'):
      return (
        <Redirect
          to={getRoutePath(`/myAccount/${match.params.section || 'profile'}`)}
      />
      );
    case getRoutePath('/connectors/:integrationId/add-new-store-for-connector'):
      return (
        <Redirect
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`)}
      />
      );
    case getRoutePath('/connectors/:integrationId/settings'):
      return (
        <Redirect
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)}
      />
      );
    case getRoutePath('/connectors/:integrationId/setup'):
      return (
        <Redirect
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/setup`)}
      />
      );
    case getRoutePath('/connectors/:integrationId/settings/tokens/:accessTokenId/:accessTokenAction'):
      if (accessTokenAction === 'audit') {
        return (
          <Redirect
            to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)}
      />
        );
      }

      return (
        <Redirect
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/admin/apitoken/edit/accesstokens/${accessTokenId}`)}
      />
      );

    case getRoutePath('/connectors/:integrationId/flows/:flowId/mapping'):
      if (childId) {
        return (
          <Redirect
            to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${childId}/flows/Product/${flowId}/utilityMapping/commonAttributes`)}
         />
        );
      }

      return (
        <Redirect
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/flows`)}
      />
      );

    default:
      return <Redirect to={getRoutePath('/home')} />;
  }
}
