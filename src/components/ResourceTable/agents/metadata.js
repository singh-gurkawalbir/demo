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
      value: function ExportDrawerLink(r) {
        return <ResourceDrawerLink resourceType="agents" resource={r} />;
      },
      orderBy: 'name',
    },
    {
      heading: 'Status',
      value: r => <OnlineStatus offline={r.offline} />,
    },
    {
      heading: 'Last updated',
      width: '150px', // minimum width to prevent heading to wrap.
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },

    {
      heading: 'Install',
      width: '175px',
      value: r => getAgentDownloadInstaller(r),
    },
    {
      heading: 'Access token',
      width: '285px',
      value: r => <AgentToken agentId={r._id} />,
    },
  ],
  rowActions: () => [Edit, References, GenerateToken, Delete],
};
