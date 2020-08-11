import React from 'react';
import { onlineStatus } from '../CeligoTable/util';
import ResourceDrawerLink from '../ResourceDrawerLink';
import { ConnectorNameComp } from '../ResourceTable/metadata';
import CeligoTimeAgo from '../CeligoTimeAgo';

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
    {
      heading: 'Connector',
      value: <ConnectorNameComp r={r} />,
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
