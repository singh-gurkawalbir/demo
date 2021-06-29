import React from 'react';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import Edit from '../../../ResourceTable/commonActions/Edit';
import Delete from '../../../ResourceTable/commonActions/Delete';

export default {
  useColumns: () => [
    {
      key: 'created',
      heading: 'Created',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      key: 'status',
      heading: 'Status',
      Value: ({rowData: r}) => r._integrationId ? 'Installed' : 'Pending',
      orderBy: 'status',
    },
    {
      key: 'integrationId',
      heading: 'Integration ID',
      Value: ({rowData: r}) => r._integrationId,
    },
  ],
  useRowActions: () => [Edit, Delete],
};
