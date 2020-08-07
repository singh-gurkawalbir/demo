import React from 'react';
import Delete from './Actions/Delete';
import Cancel from './Actions/Cancel';
import DateTimeDisplay from '../../../components/DateTimeDisplay';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'From user',
        value: r => r && <><div>{r?.ownerUser?.name || 'Me'}</div><div>{r?.ownerUser?.email}</div></>,
        orderBy: 'name',
      },
      {
        heading: 'To user',
        value: r => r && <><div>{r?.transferToUser?.name || 'Me'}</div><div>{r?.transferToUser?.email}</div></>,
      },
      {
        heading: 'Integrations',
        value: r => r && r.integrations,
      },
      { heading: 'Status', value: r => r && (r.dismissed ? 'dismissed' : r.status)},
      {
        heading: 'Transfer date',
        value: r => r && <DateTimeDisplay dateTime={r.transferredAt} />,
      },
    ];

    return columns;
  },
  rowActions: [Cancel, Delete],
};
