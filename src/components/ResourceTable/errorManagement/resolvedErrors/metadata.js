import React from 'react';
import Retry from '../actions/Retry';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import OverflowWrapper from '../cells/OverflowWrapper';

export default {
  columns: [
    {
      headerValue: function SelectAll(r, actionProps) {
        return <SelectAllErrors {...actionProps} />;
      },
      heading: 'Select All',
      value: function Select(error, actionProps) {
        return <SelectError error={error} {...actionProps} />;
      },
    },
    {
      heading: 'Message',
      width: '30%',
      value: r => <OverflowWrapper message={r.message} />,
    },
    {
      heading: 'Code',
      width: '20%',
      value: r => <OverflowWrapper message={r.code} />,
    },
    {
      heading: 'Source',
      width: '10%',
      value: r => <OverflowWrapper message={r.source} />,
    },
    {
      heading: 'Timestamp',
      width: '10%',
      value: r => <CeligoTimeAgo date={r.occurredAt} />,
    },
    {
      heading: 'Resolved by',
      width: '15%',
      value: r => <UserName userId={r.resolvedBy} />,
    },
    {
      heading: 'Resolved at',
      width: '10%',
      value: r => <CeligoTimeAgo date={r.resolvedAt} />,
    },
  ],
  rowActions: ({ retryDataKey }, { actionInProgress }) => {
    const actions = [];

    if (actionInProgress) return actions;

    if (retryDataKey) {
      actions.push(Retry);
    }
    actions.push(ViewErrorDetails);

    return actions;
  },
};
