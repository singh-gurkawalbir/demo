import React from 'react';
import { TimeAgo } from '@celigo/fuse-ui';
import Edit from '../../../ResourceTable/commonActions/Edit';
import Delete from '../../../ResourceTable/commonActions/Delete';

export default {
  useColumns: () => [
    {
      key: 'created',
      heading: 'Created',
      isLoggable: true,
      Value: ({rowData: r}) => <TimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      key: 'status',
      heading: 'Status',
      isLoggable: true,
      Value: ({rowData: r}) => r._integrationId ? 'Installed' : 'Pending',
      orderBy: 'status',
    },
    {
      key: 'integrationId',
      heading: 'Integration ID',
      isLoggable: true,
      Value: ({rowData: r}) => r._integrationId,
    },
  ],
  useRowActions: () => [Edit, Delete],
};
