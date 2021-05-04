import React from 'react';
import Delete from '../commonActions/Delete';
import GenerateToken from '../commonActions/GenerateToken';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import OnlineStatus from '../commonCells/OnlineStatus';
import AgentDownloadInstaller from '../../AgentDownloadInstaller';
import AgentToken from '../../AgentToken';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import CeligoTimeAgo from '../../CeligoTimeAgo';

const getAgentDownloadInstaller = agent => (
  <AgentDownloadInstaller agentId={agent._id} />
);
// const getAgentToken = agent => <AgentToken agentId={agent._id} />;

export default {
  columns: [
    {
      heading: 'Name',
      Value: ({rowData: r}) => <ResourceDrawerLink resourceType="agents" resource={r} />,
      orderBy: 'name',
    },
    {
      heading: 'Status',
      Value: ({rowData: r}) => <OnlineStatus offline={r.offline} />,
    },
    {
      heading: 'Last heartbeat',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastHeartbeatAt} />,
      orderBy: 'lastHeartbeatAt',
    },
    {
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },

    {
      heading: 'Install',
      Value: ({rowData: r}) => getAgentDownloadInstaller(r),
    },
    {
      heading: 'Access token',
      Value: ({rowData: r}) => <AgentToken agentId={r._id} />,
    },
  ],
  rowActions: () => [Edit, References, GenerateToken, Delete],
};
