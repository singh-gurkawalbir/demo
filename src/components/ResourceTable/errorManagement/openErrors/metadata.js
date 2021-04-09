import React from 'react';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import ViewHttpRequest from '../actions/ViewHttpRequest';
import ViewHttpResponse from '../actions/ViewHttpResponse';
import EditRetryData from '../actions/EditRetry';
import DownloadRetryData from '../actions/DownloadRetry';
import SelectError from '../cells/SelectError';
import SelectSource from '../cells/SelectSource';
import SelectDate from '../cells/SelectDate';
import SelectAllErrors from '../cells/SelectAllErrors';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import TextOverflowCell from '../../../TextOverflowCell';
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
          errorId={r.errorId}
          flowId={flowId}
          resourceId={resourceId}
          exportDataURI={r.exportDataURI}
          importDataURI={r.importDataURI}
      />
      ),
    },
    {
      heading: 'Code',
      value: r => <TextOverflowCell message={r.code} />,
      width: '15%',
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
      width: '15%',
      value: r => <CeligoTimeAgo date={r.occurredAt} />,
    },
  ],
  rowActions: ({retryDataKey, source, reqAndResKey}, { actionInProgress }) => {
    if (actionInProgress) return [];
    const actions = [
      Resolve,
      ...(retryDataKey ? [Retry] : []),
      ViewErrorDetails,
      ...(retryDataKey ? [EditRetryData] : []),
      // IO-19304, for errors occuring at FTP bridge, retry data returned will be metadata and not actual retry data,
      // hence show download option
      ...(retryDataKey && source === 'ftp_bridge' ? [DownloadRetryData] : []),
    ];

    if (reqAndResKey) {
      actions.push(ViewHttpRequest, ViewHttpResponse);
    }

    return actions;
  },
};
