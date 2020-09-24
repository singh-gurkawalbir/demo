import React from 'react';
import Retry from '../actions/Retry';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import ErrorMessage from '../cells/ErrorMessage';

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
      value: r => <ErrorMessage message={r.message} />,
    },
    {
      heading: 'Code',
      value: r => r.code,
    },
    { heading: 'Source', value: r => r.source },
    {
      heading: 'Timestamp',
      value: r => <CeligoTimeAgo date={r.resolvedAt} />,
    },
    {
      heading: 'Resolved by',
      value: r => <UserName userId={r.resolvedBy} />,
    },
  ],
  rowActions: ({ retryDataKey }, { actionInProgress }) => {
    if (actionInProgress) return [];

    if (retryDataKey) return [Retry];

    return [];
  },
};
