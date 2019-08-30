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

export default {
  exports: [
    { heading: 'Name', value: r => r.name, sortOn: 'name' },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'Updated on',
      value: r => r.lastModified,
      sortOn: 'lastModified',
    },
  ],

  connections: [
    { heading: 'Name', value: r => r.name, sortOn: 'name' },
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
      value: r => r.lastModified,
      sortOn: 'lastModified',
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
    { heading: 'Name', value: r => r.name, sortOn: 'name' },
    { heading: 'Status', value: r => (r.offline ? 'Offline' : 'Online') },
    {
      heading: 'Updated on',
      value: r => r.lastModified,
      sortOn: 'lastModified',
    },
  ],

  default: [
    { heading: 'Name', value: r => r.name, sortOn: 'name' },
    {
      heading: 'Updated on',
      value: r => r.lastModified,
      sortOn: 'lastModified',
    },
  ],
};
