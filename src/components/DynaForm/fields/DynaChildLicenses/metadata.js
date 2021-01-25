import React from 'react';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import Edit from '../../../ResourceTable/commonActions/Edit';
import Delete from '../../../ResourceTable/commonActions/Delete';

export default {
  columns: [
    {
      heading: 'Created',
      value: r => <CeligoTimeAgo date={r.created} />,
      orderBy: 'created',
    },
    {
      heading: 'Status',
      value: r => (r._integrationId ? 'Installed' : 'Pending'),
    },
    {
      heading: 'Integration ID',
      value: r => r._integrationId,
    },
  ],
  rowActions: [Edit, Delete],
};
