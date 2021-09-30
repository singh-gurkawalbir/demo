import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import agentsMetadata from './metadata/agents';
import endpointsMetadata from './metadata/endpoints';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import Progressbar from './Progressbar';
import flowsMetadata from './metadata/flows';
import tradingPartnersMetadata from './metadata/tradingpartners';
import ResourceDrawer from '../../../components/drawer/Resource';

const connectionsFilterConfig = {
  type: 'connections',
  ignoreEnvironmentFilter: true,
};
const flowsFilterConfig = {
  type: 'flows',
  ignoreEnvironmentFilter: true,
};
const agentsFilterConfig = {
  type: 'agents',
  ignoreEnvironmentFilter: true,
};
const integrationsFilterConfig = {
  type: 'integrations',
  ignoreEnvironmentFilter: true,
};

export default function LicenseTable() {
  const match = useRouteMatch();
  const {type, env} = match.params;
  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const licenseEntitlementUsage = useSelector(state => selectors.getLicenseEntitlementUsage(state));

  const data = {
    production: {
      endpoints: {
        resource: licenseEntitlementUsage?.production?.endpointUsage?.endpoints,
        totalResources: licenseActionDetails?.totalNumberofProductionEndpoints,
        totalUsedResources: licenseEntitlementUsage?.production?.endpointUsage?.numConsumed,
      },
      flows: {
        resource: licenseEntitlementUsage?.production?.flowUsage?.flows,
        totalResources: licenseActionDetails?.totalNumberofProductionFlows,
        totalUsedResources: licenseEntitlementUsage?.production?.flowUsage?.numEnabled,
      },
      tradingpartners: {
        resource: licenseEntitlementUsage?.production?.tradingPartnerUsage?.tradingPartners,
        totalResources: licenseActionDetails?.totalNumberofProductionTradingPartners,
        totalUsedResources: licenseEntitlementUsage?.production?.tradingPartnerUsage?.numConsumed,
      },
      agents: {
        resource: licenseEntitlementUsage?.production?.agentUsage?.agents,
        totalResources: licenseActionDetails?.totalNumberofProductionAgents,
        totalUsedResources: licenseEntitlementUsage?.production?.agentUsage?.numActive,
      },

    },
    sandbox: {
      endpoints: {
        resource: licenseEntitlementUsage?.sandbox?.endpointUsage?.endpoints,
        totalResources: licenseActionDetails?.totalNumberofSandboxEndpoints,
        totalUsedResources: licenseEntitlementUsage?.sandbox?.endpointUsage?.numConsumed,
      },
      flows: {
        resource: licenseEntitlementUsage?.sandbox?.flowUsage?.flows,
        totalResources: licenseActionDetails?.totalNumberofSandboxFlows,
        totalUsedResources: licenseEntitlementUsage?.sandbox?.flowUsage?.numEnabled,
      },
      tradingpartners: {
        resource: licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.tradingPartners,
        totalResources: licenseActionDetails?.totalNumberofSandboxTradingPartners,
        totalUsedResources: licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.numConsumed,
      },
      agents: {
        resource: licenseEntitlementUsage?.sandbox?.agentUsage?.agents,
        totalResources: licenseActionDetails?.totalNumberofSandboxAgents,
        totalUsedResources: licenseEntitlementUsage?.sandbox?.agentUsage?.numActive,
      },
    },
  };
  const {resource, totalResources, totalUsedResources} = data[env][type];

  let metadata;

  if (type === 'endpoints') {
    metadata = endpointsMetadata;
  } else if (type === 'flows') {
    metadata = flowsMetadata;
  } else if (type === 'tradingpartners') {
    metadata = tradingPartnersMetadata;
  } else if (type === 'agents') {
    metadata = agentsMetadata;
  }

  const connections = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectionsFilterConfig
  ).resources;
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const agents = useSelectorMemo(
    selectors.makeResourceListSelector,
    agentsFilterConfig
  ).resources;
  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;
  const resourceList = [];

  if (type === 'endpoints') {
    resource.forEach(res => {
      res.connections.forEach(conn => {
        const connection = connections.find(c => (c._id === conn._id));

        connection && resourceList.push({...connection});
      });
    });
  } else if (type === 'flows') {
    resource.forEach(res => {
      const flow = flows.find(f => (f._id === res._id));
      const integration = integrations.find(i => (i._id === flow?._integrationId));

      flow && resourceList.push({...flow, integrationName: integration?.name || 'Standalone flows', integrationId: integration?._id || 'none'});
    });
  } else if (type === 'tradingpartners') {
    resource.forEach(res => {
      const connection = connections.find(c => (c._id === res._id));

      connection && resourceList.push({...connection});
    });
  } else if (type === 'agents') {
    resource.forEach(res => {
      const agent = agents.find(a => (a._id === res._id));

      agent && resourceList.push({...agent});
    });
  }

  return (
    <>
      <Progressbar
        usedCount={totalUsedResources}
        totalCount={totalResources}
        hideButton
      />
      <CeligoTable data={resourceList} {...metadata} />
      <ResourceDrawer />
    </>
  );
}
