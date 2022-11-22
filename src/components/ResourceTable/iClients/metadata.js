import React from 'react';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import AuditLogs from '../commonActions/AuditLogs';
import Delete from '../commonActions/Delete';
import References from '../commonActions/References';
import Edit from '../commonActions/Edit';
import ResourceDrawerLink from '../../ResourceDrawerLink';

export default {
  useColumns: () => {
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        isLoggable: true,
        Value: ({rowData: r}) => <ResourceDrawerLink resourceType="iClients" resource={r} />,
        orderBy: 'name',
      },
      {
        key: 'provider',
        isLoggable: true,
        heading: 'Provider',
        Value: ({rowData: r}) => r.provider,
      },
      {
        key: 'lastUpdated',
        heading: 'Last updated',
        isLoggable: true,
        Value: ({rowData: r}) => <CeligoTimeAgo date={r.lastModified} />,
        orderBy: 'lastModified',
      },
    ];

    return columns;
  },

  useRowActions: () => [Edit, AuditLogs, References, Delete],
};
