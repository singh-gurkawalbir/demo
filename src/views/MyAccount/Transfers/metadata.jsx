import React from 'react';
import Delete from './Actions/Delete';
import Cancel from './Actions/Cancel';
import DateTimeDisplay from '../../../components/DateTimeDisplay';

export default {
  columns: () => {
    const columns = [
      {
        heading: 'From user',
        value: r => r && r.fromUser,
        orderBy: 'name',
      },
      {
        heading: 'To user',
        value: r => r && r.toUser,
      },
      {
        heading: 'Integrations',
        value: r => r && r.integrations,
      },
      { heading: 'Status',
        value: r => {
          if (r?.dismissed) {
            return 'Dismissed';
          }
          return r?.status === 'unapproved' ? 'Pending acceptance' : r?.status.charAt(0).toUpperCase() + r?.status.slice(1);
        }
      },
      {
        heading: 'Transfer date',
        value: r => r && <DateTimeDisplay dateTime={r.transferredAt} />,
      },
    ];

    return columns;
  },
  rowActions: [Cancel, Delete],
};
