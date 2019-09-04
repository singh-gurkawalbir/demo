import Delete from '../../actions/Delete';
import References from '../../actions/References';
import Edit from '../../actions/Edit';
import AgentDownloadInstaller from '../../../../../components/AgentDownloadInstaller';
import AgentToken from '../../../../../components/AgentToken';
import { getResourceLink, onlineStatus, formatLastModified } from '../util';

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
      value: r => onlineStatus(r),
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
  actions: [Edit, References, Delete],
};
