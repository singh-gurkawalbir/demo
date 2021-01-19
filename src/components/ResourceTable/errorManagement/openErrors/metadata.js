import React from 'react';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import EditRetryData from '../actions/EditRetry';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import SelectSource from '../cells/SelectSource';
import SelectDate from '../cells/SelectDate';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import TextOverflowCell from '../cells/TextOverflowCell';
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
      width: '40%',
      value: (r, { flowId, resourceId }) => (
        <ErrorMessage
          message={r.message}
          flowId={flowId}
          resourceId={resourceId}
          traceKey={r.traceKey}
          exportDataURI={r.exportDataURI}
          importDataURI={r.importDataURI}
      />
      ),
    },
    {
      heading: 'Code',
      value: r => <TextOverflowCell message={r.code} />,
      width: '18%',
    },
    {
      headerValue: function SelectOpenSource(r, actionProps) {
        return <SelectSource {...actionProps} />;
      },
      value: r => <TextOverflowCell message={r.source} />,
      width: '15%',
    },
    {
      headerValue: function SelectTimestamp(r, actionProps) {
        return <SelectDate {...actionProps} />;
      },
      width: '12%',
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
