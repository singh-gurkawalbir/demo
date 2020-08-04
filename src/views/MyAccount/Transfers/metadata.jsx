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
          if (r?.accepted && ['queued', 'started'].indexOf(r?.status) > -1) {
            return 'Processing';
          }
          if (r?.accepted && r?.status === 'done') {
            return 'Accepted';
          }

          return r?.status === 'unapproved' ? 'Pending acceptance' : r?.status.charAt(0).toUpperCase() + r?.status.slice(1);
        },
      },
      {
        heading: 'Transfer date',
        value: r => r && <DateTimeDisplay dateTime={r.transferredAt} />,
      },
    ];

    return columns;
  },
  rowActions: r => {
    const actionItems = [];

    // User cannot perform delete/cancel action on invited transfers
    if (r?.fromUser === 'Me' && ['unapproved', 'done', 'canceled', 'failed'].indexOf(r?.status) > -1) {
      actionItems.push(Delete);
    }
    if (r?.fromUser === 'Me' && ['unapproved', 'queued'].indexOf(r?.status) > -1) {
      actionItems.push(Cancel);
    }

    return actionItems;
  },
};
