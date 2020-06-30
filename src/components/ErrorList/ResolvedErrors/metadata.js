import React from 'react';
import Retry from '../actions/Retry';
import SelectError from '../components/SelectError';
import SelectAllErrors from '../components/SelectAllErrors';

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
      value: r => r.occurredAt,
    },
    {
      heading: 'Resolved By',
      value: r => r.resolvedBy,
    },
  ],
  rowActions: ({ retryDataKey }, { actionInProgress }) => {
    if (actionInProgress) return [];

    if (retryDataKey) return [Retry];

    return [];
  },
};
