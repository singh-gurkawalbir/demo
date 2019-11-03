import {
  getResourceLink,
  onlineStatus,
  formatLastModified,
  getConnectorName,
} from '../CeligoTable/util';

export default {
  columns: [
    {
      heading: 'Name',
      value: (r, actionProps, location) =>
        getResourceLink('connections', r, location),
      orderBy: 'name',
    },
    { heading: 'Status', value: r => onlineStatus(r) },
    { heading: 'Connector', value: r => getConnectorName(r) },
    {
      heading: 'API',
      value: r => {
        if (r.type === 'rest') return r && r.rest && r.rest.baseURI;

        if (r.type === 'http') return r && r.http && r.http.baseURI;

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
      value: r => {
        if (!r.queues) return 0;
        const queue = r.queues.find(q => q.name === r._id);

        return queue ? queue.size : 0;
      },
    },
  ],
};
