import React from 'react';
import Delete from '../commonActions/Delete';
import GenerateToken from '../commonActions/GenerateToken';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import AgentDownloadInstaller from '../../AgentDownloadInstaller';
import AgentToken from '../../AgentToken';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import OnlineStatus from '../../OnlineStatus';

const getAgentDownloadInstaller = agent => (
  <AgentDownloadInstaller agentId={agent._id} />
);
// const getAgentToken = agent => <AgentToken agentId={agent._id} />;

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="agents" resource={r} />,
      orderBy: 'name',
    },
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => <OnlineStatus offline={r.offline} />,
    },
    {
      key: 'lastHeartBeat',
      heading: 'Last heartbeat',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastHeartbeatAt} />,
      orderBy: 'lastHeartbeatAt',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },

    {
      key: 'install',
      heading: 'Install',
      Value: ({rowData: r}) => getAgentDownloadInstaller(r),
    },
    {
      key: 'accessToken',
      heading: 'Access token',
      Value: ({rowData: r}) => <AgentToken agentId={r._id} />,
    },
  ],
  useRowActions: () => [Edit, References, GenerateToken, Delete],
};
