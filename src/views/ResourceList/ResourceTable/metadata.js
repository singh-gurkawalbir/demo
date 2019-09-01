import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import StatusCircle from '../../../components/HomePageCard/Header/Status/StatusCircle';
import getRoutePath from '../../../utils/routePaths';
import { getApp } from '../../../constants/applications';
import { getResourceSubType } from '../../../utils/resource';
import Delete from './actions/Delete';
import References from './actions/References';
import AgentDownloadInstaller from '../../../components/AgentList/AgentDownloadInstaller';
import AgentToken from '../../../components/AgentToken';

const getResourceLink = (resourceType, resource) => (
  <Link to={getRoutePath(`/${resourceType}/edit/${resource._id}`)}>
    {resource.name}
  </Link>
);
const getConnectorName = resource => {
  const { type, assistant, resourceType } = getResourceSubType(resource);
  let app;

  if (type === 'rdbms') {
    if (resourceType === 'connections') {
      app = getApp(resource.rdbms.type);
    } else {
      return 'RDBMS';
    }
  } else {
    app = getApp(type, assistant);
  }

  return app.name;
};

const formatLastModified = lastModified => {
  const formatter = (value, unit, suffix) => `${value}${unit[0]} ${suffix}`;

  return <TimeAgo formatter={formatter} date={lastModified} />;
};

const getAgentDownloadInstaller = agent => (
  <AgentDownloadInstaller agentId={agent._id} />
);
const getAgentToken = agent => <AgentToken agentId={agent._id} />;
const onlineStatus = r => (
  <div style={{ display: 'flex' }}>
    <StatusCircle size="small" variant={r.offline ? 'error' : 'success'} />
    {r.offline ? 'Offline' : 'Online'}
  </div>
);

export default function(resourceType) {
  const metadata = {
    exports: {
      columns: [
        {
          heading: 'Name',
          value: r => getResourceLink(resourceType, r),
          orderBy: 'name',
        },
        { heading: 'Connector', value: r => getConnectorName(r) },
        {
          heading: 'Updated on',
          value: r => formatLastModified(r.lastModified),
          orderBy: 'lastModified',
        },
      ],
      actions: [Delete, References],
    },

    connections: {
      columns: [
        {
          heading: 'Name',
          value: r => getResourceLink(resourceType, r),
          orderBy: 'name',
        },
        { heading: 'Status', value: r => onlineStatus(r) },
        { heading: 'Connector', value: r => getConnectorName(r) },
        {
          heading: 'API',
          value: r => {
            if (r.type === 'rest') return r.rest.baseURI;

            if (r.type === 'http') return r.http.baseURI;

            return null;
          },
        },
        {
          heading: 'Updated on',
          value: r => formatLastModified(r.lastModified),
          orderBy: 'lastModified',
        },
        {
          heading: 'Queue Size',
          align: 'right',
          value: r => {
            if (!r.queues) return 0;
            const queue = r.queues.find(q => q.name === r._id);

            return queue ? queue.size : 0;
          },
        },
      ],
      actions: [Delete, References],
    },

    agents: {
      columns: [
        {
          heading: 'Name',
          value: r => getResourceLink(resourceType, r),
          orderBy: 'name',
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
          value: r => getAgentToken(r),
        },
        {
          heading: 'Install',
          value: r => getAgentDownloadInstaller(r),
        },
      ],
      actions: [Delete, References],
    },

    default: {
      columns: [
        {
          heading: 'Name',
          value: r => getResourceLink(resourceType, r),
          orderBy: 'name',
        },
        {
          heading: 'Updated on',
          value: r => formatLastModified(r.lastModified),
          orderBy: 'lastModified',
        },
      ],
      actions: [Delete, References],
    },
  };

  return metadata[resourceType] || metadata.default;
}
