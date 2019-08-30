import TimeAgo from 'react-timeago';
// import { Link } from 'react-router-dom';
// import getRoutePath from '../../../utils/routePaths';
import { getApp } from '../../../constants/applications';
import { getResourceSubType } from '../../../utils/resource';

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

export default {
  exports: [
    { heading: 'Name', value: r => r.name, orderBy: 'name' },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],

  connections: [
    { heading: 'Name', value: r => r.name, orderBy: 'name' },
    { heading: 'Status', value: r => (r.offline ? 'Offline' : 'Online') },
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

  agents: [
    { heading: 'Name', value: r => r.name, orderBy: 'name' },
    { heading: 'Status', value: r => (r.offline ? 'Offline' : 'Online') },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],

  default: [
    { heading: 'Name', value: r => r.name, orderBy: 'name' },
    {
      heading: 'Updated on',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
  ],
};
