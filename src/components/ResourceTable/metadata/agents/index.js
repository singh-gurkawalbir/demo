import React from 'react';
import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AgentDownloadInstaller from '../../../AgentDownloadInstaller';
import AgentToken from '../../../AgentToken';
import { formatLastModified, onlineStatus } from '../../../CeligoTable/util';
import ResourceDrawerLink from '../../../ResourceDrawerLink';
import GenerateToken from '../../actions/GenerateToken';
import Edit from '../../actions/Edit';

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
    { heading: 'Status', value: r => onlineStatus(r) },
    {
      heading: 'Last updated',
      width: '150px', // minimum width to prevent heading to wrap.
      value: r => formatLastModified(r.lastModified),
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
  rowActions: () => [Edit, GenerateToken, References, Delete],
};
