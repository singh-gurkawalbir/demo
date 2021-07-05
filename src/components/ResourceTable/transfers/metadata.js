import React from 'react';
import Delete from './actions/Delete';
import Cancel from './actions/Cancel';
import TableHeadWithRefreshIcon from '../commonCells/RefreshableHeading';
import DateTimeDisplay from '../../DateTimeDisplay';
import { capitalizeFirstLetter } from '../../../utils/string';

export default {
  useColumns: () => [
    {
      key: 'fromUser',
      heading: 'From user',
      Value: ({rowData: r}) => r && <><div>{r?.ownerUser?.name || 'Me'}</div><div>{r?.ownerUser?.email}</div></>,
      orderBy: 'name',
    },
    {
      key: 'toUser',
      heading: 'To user',
      Value: ({rowData: r}) => r && <><div>{r?.transferToUser?.name || 'Me'}</div><div>{r?.transferToUser?.email}</div></>,
    },
    {
      key: 'integrations',
      heading: 'Integrations',
      Value: ({rowData: r}) => r && r.integrations,
    },
    {
      key: 'status',
      heading: <TableHeadWithRefreshIcon label="Status" resourceType="transfers" />,
      Value: ({rowData: r}) => {
        if (!r) {
          return '';
        }
        if (r.dismissed) {
          return 'Dismissed';
        }
        if (r.accepted && ['queued', 'started'].indexOf(r.status) > -1) {
          return 'Processing';
        }
        if (!r.ownerUser && r.accepted && r.status === 'done') {
          return 'Accepted';
        }

        return r.status === 'unapproved'
          ? 'Pending acceptance'
          : capitalizeFirstLetter(r.status);
      },
    },
    {
      key: 'transferDate',
      heading: 'Transfer date',
      Value: ({rowData: r}) => r && <DateTimeDisplay dateTime={r.transferredAt} />,
    },
  ],
  useRowActions: r => {
    const actionItems = [];

    // User cannot perform delete/cancel action on invited transfers
    if (!r.ownerUser && ['unapproved', 'queued'].indexOf(r?.status) > -1 && !r?.dismissed) {
      actionItems.push(Cancel);
    }
    if (!r.ownerUser && ['unapproved', 'done', 'canceled', 'failed'].indexOf(r?.status) > -1) {
      actionItems.push(Delete);
    }

    return actionItems;
  },
};
