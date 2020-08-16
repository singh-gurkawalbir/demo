import React from 'react';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import EditRetryData from '../actions/EditRetry';
import SelectError from '../components/SelectError';
import SelectAllErrors from '../components/SelectAllErrors';
import DateTimeDisplay from '../../DateTimeDisplay';

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
      value: r => r.message,
    },
    { heading: 'Source', value: r => r.source },
    {
      heading: 'Code',
      value: r => r.code,
    },
    {
      heading: 'Time stamp',
      value: r => <DateTimeDisplay dateTime={r.occurredAt} />,
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
