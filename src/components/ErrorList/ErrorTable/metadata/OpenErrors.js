import React from 'react';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import EditRetryData from '../actions/EditRetry';
import SelectError from '../components/SelectError';
import SelectAllErrors from '../components/SelectAllErrors';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import ErrorMessage from '../components/ErrorMessage';

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
      width: '40%',
      value: r => <ErrorMessage message={r.message} />,
    },
    { heading: 'Source', value: r => r.source },
    {
      heading: 'Code',
      value: r => r.code,
    },
    {
      heading: 'Time stamp',
      value: r => <CeligoTimeAgo date={r.occurredAt} />,
    },
  ],
  rowActions: ({ retryDataKey }, { actionInProgress }) => {
    if (actionInProgress) return [];
    const actions = [
      ...(retryDataKey ? [EditRetryData] : []),
      Resolve,
      ...(retryDataKey ? [Retry] : []),
      ViewErrorDetails,
    ];

    return actions;
  },
};
