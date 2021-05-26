import React from 'react';
import ResourceDrawerLink from '../ResourceDrawerLink';
import ConnectorName from '../ResourceTable/commonCells/ConnectorName';
import OnlineStatus from '../ResourceTable/commonCells/OnlineStatus';
import CeligoTimeAgo from '../CeligoTimeAgo';
import { useGetTableContext } from '../CeligoTable/TableContext';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      Value: ({rowData: r}) => {
        const {onClose} = useGetTableContext();

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
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => <OnlineStatus offline={r.offline} />,
      width: '100px',
    },
    {
      key: 'connector',
      heading: 'Connector',
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
      width: '200px',
    },
    {
      key: 'api',
      heading: 'API',
      Value: ({rowData: r}) => {
        if (r.type === 'rest') return r?.rest?.baseURI;

        if (r.type === 'http') return r?.http?.baseURI;

        return null;
      },
    },
    {
      key: 'lastModified',
      heading: 'Last updated',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
      width: '170px',
    },
    {
      key: 'queueSize',
      heading: 'Queue size',
      Value: ({rowData: r}) => r.queueSize || 0,
      width: '120px',
    },
  ],
};
