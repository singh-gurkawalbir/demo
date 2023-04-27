import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import Delete from '../commonActions/Delete';
import GenerateToken from '../commonActions/GenerateToken';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import AgentDownloadInstaller from '../../AgentDownloadInstaller';
import AgentToken from '../../AgentToken';
import ResourceDrawerLink from '../../ResourceDrawerLink';
import OnlineStatus from '../../OnlineStatus';
import AuditLogs from '../commonActions/AuditLogs';

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
      isLoggable: true,
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => <OnlineStatus offline={r.offline} />,
    },
    {
      key: 'lastHeartBeat',
      heading: 'Last heartbeat',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastHeartbeatAt} />,
      orderBy: 'lastHeartbeatAt',
    },
    {
      key: 'lastUpdated',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },

    {
      key: 'install',
      heading: 'Install',
      isLoggable: true,
      Value: ({rowData: r}) => getAgentDownloadInstaller(r),
    },
    {
      key: 'accessToken',
      heading: 'Access token',
      Value: ({rowData: r}) => <AgentToken agentId={r._id} />,
    },
  ],
  useRowActions: () => [Edit, AuditLogs, References, GenerateToken, Delete],
};
