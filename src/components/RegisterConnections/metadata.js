import React from 'react';
import ResourceDrawerLink from '../ResourceDrawerLink';
import ConnectorName from '../ResourceTable/commonCells/ConnectorName';
import OnlineStatus from '../ResourceTable/commonCells/OnlineStatus';
import CeligoTimeAgo from '../CeligoTimeAgo';

export default {
  columns: (r, { onClose }) => [
    {
      heading: 'Name',
      value: r => (
        <ResourceDrawerLink
          resourceType="connections"
          resource={r}
          onClick={onClose}
          />
      ),
      orderBy: 'name',
    },
    { heading: 'Status',
      value: r => <OnlineStatus offline={r.offline} />,
    },
    {
      heading: 'Connector',
      value: r => <ConnectorName r={r} />,
    },
    {
      heading: 'API',
      value: r => {
        if (r.type === 'rest') return r?.rest?.baseURI;

        if (r.type === 'http') return r?.http?.baseURI;

        return null;
      },
    },
    {
      heading: 'Last updated',
      value: r => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
    },
    {
      heading: 'Queue size',
      value: r => r.queueSize || 0,
    },
  ],
};
