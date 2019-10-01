import Delete from '../../actions/Delete';
import References from '../../actions/References';
import AgentDownloadInstaller from '../../../AgentDownloadInstaller';
import AgentToken from '../../../AgentToken';
import AgentStatus from '../../../AgentStatus';
import { getResourceLink, formatLastModified } from '../../../CeligoTable/util';

const getAgentDownloadInstaller = agent => (
  <AgentDownloadInstaller agentId={agent._id} />
);
const getAgentToken = agent => <AgentToken agentId={agent._id} />;

export default {
  columns: [
    {
      heading: 'Name',
      value: r => getResourceLink('agents', r),
      orderBy: 'name',
    },
    {
      heading: 'Description',
      value: r => r.description,
      orderBy: 'description',
    },
    {
      heading: 'Status',
      value(r) {
        return <AgentStatus agentId={r._id} />;
      },
    },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Access Token',
      width: '250px',
      value: r => getAgentToken(r),
    },
    {
      heading: 'Install',
      width: '175px',
      value: r => getAgentDownloadInstaller(r),
    },
  ],
  rowActions: () => [References, Delete],
};
