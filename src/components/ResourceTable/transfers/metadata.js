import React from 'react';
import Delete from './actions/Delete';
import Cancel from './actions/Cancel';
import TableHeadWithRefreshIcon from '../commonCells/RefreshableHeading';
import DateTimeDisplay from '../../DateTimeDisplay';

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
      { heading: <TableHeadWithRefreshIcon label="Status" resourceType="transfers" />,
        value: r => {
          if (!r) {
            return '';
          }
          if (r.dismissed) {
            return 'Dismissed';
          }
          if (r.fromUser === 'Me' && r.accepted && ['queued', 'started'].indexOf(r.status) > -1) {
            return 'Processing';
          }
          if (r.fromUser === 'Me' && r.accepted && r.status === 'done') {
            return 'Accepted';
          }

          return r.status === 'unapproved'
            ? 'Pending acceptance'
            : r.status.charAt(0).toUpperCase() + r.status.slice(1);
        },
      },
      { heading: 'Status', value: r => r && (r.dismissed ? 'dismissed' : r.status)},
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
    if (r?.fromUser === 'Me' && ['unapproved', 'queued'].indexOf(r?.status) > -1 && !r?.dismissed) {
      actionItems.push(Cancel);
    }

    return actionItems;
  },
};
