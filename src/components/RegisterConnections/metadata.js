import {
  onlineStatus,
  formatLastModified,
  getConnectorName,
} from '../CeligoTable/util';
import ResourceDrawerLink from '../ResourceDrawerLink';

export default {
  columns: (r, { onClose }) => [
    {
      heading: 'Name',
      value: function RegisterConnectionsDrawerLink(r) {
        return (
          <ResourceDrawerLink
            resourceType="connections"
            resource={r}
            onClick={onClose}
          />
        );
      },
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
      heading: 'Last updated',
      value: r => formatLastModified(r.lastModified),
      orderBy: 'lastModified',
    },
    {
      heading: 'Queue Size',
      value: r => r.queueSize || 0,
    },
  ],
};
