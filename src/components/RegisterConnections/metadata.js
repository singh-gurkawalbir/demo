import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import ResourceDrawerLink from '../ResourceDrawerLink';
import ConnectorName from '../ResourceTable/commonCells/ConnectorName';
import { useGetTableContext } from '../CeligoTable/TableContext';
import Status from '../Buttons/Status';

export default {
  useColumns: () => [
    {
      key: 'name',
      heading: 'Name',
      isLoggable: true,
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
      isLoggable: true,
      Value: ({rowData: r}) => (
        <Status variant={r.offline ? 'error' : 'success'}>
          {r.offline ? 'Offline' : 'online'}
        </Status>
      ),
      width: '100px',
    },
    {
      key: 'connector',
      heading: 'Connector',
      isLoggable: true,
      Value: ({rowData: r}) => <ConnectorName resource={r} />,
      width: '200px',
    },
    {
      key: 'api',
      heading: 'API',
      isLoggable: true,
      Value: ({rowData: r}) => {
        if (r.type === 'rest') return r?.rest?.baseURI;

        if (r.type === 'http') return r?.http?.baseURI;

        return null;
      },
    },
    {
      key: 'lastModified',
      heading: 'Last updated',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.lastModified} />,
      orderBy: 'lastModified',
      width: '170px',
    },
    {
      key: 'queueSize',
      heading: 'Queue size',
      isLoggable: true,
      Value: ({rowData: r}) => r.queueSize || 0,
      width: '120px',
    },
  ],
};
