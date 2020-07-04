import React from 'react';
// import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import CeligoTable from '../../../components/CeligoTable';
import agentsMetadata from './metadata/agents';
import endpointsMetadata from './metadata/endpoints';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

import flowsMetadata from './metadata/flows';
import tradingPartnersMetadata from './metadata/tradingpartners';

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

export default function Resorces({type, resource}) {
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
  let connection;
  let flow;
  let agent;
  // const licenseEntitlementUsage = useSelector(state => selectors.getLicenseEntitlementUsage(state));

  // const endpoints = licenseEntitlementUsage?.production?.endpointUsage?.endpoints;
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
  const resourceList = [];
  if (type === 'endpoints') {
    resource.forEach(res => {
      res.connections.forEach(conn => {
        connection = connections.find(c => (c._id === conn._id));

        connection && resourceList.push({...connection});
      });
    });
  } else if (type === 'flows') {
    resource.forEach(res => {
      flow = flows.find(f => (f._id === res._id));

      flow && resourceList.push({...flow, integrationName: res?.integration?.name});
    });
  } else if (type === 'tradingpartners') {
    resource.forEach(res => {
      connection = connections.find(c => (c._id === res._id));
      connection && resourceList.push({...connection});
    });
  } else if (type === 'agents') {
    resource.forEach(res => {
      agent = agents.find(a => (a._id === res._id));
      agent && resourceList.push({...agent});
    });
  }


  return (
    <>
      <LoadResources required resources="connections,flows,integrations,agents">
        <>
          <CeligoTable
            resourceType="connections"
            data={resourceList}
            {...metadata}
            />
        </>
      </LoadResources>
    </>
  );
}
