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
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  columns: [
    {
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectAllErrors {...tableContext} />;
      },
      heading: 'Select All',
      Value: ({rowData: error}) => {
        const tableContext = useGetTableContext();

        return <SelectError error={error} {...tableContext} />;
      },
    },
    {
      heading: 'Message',
      width: '40%',
      Value: ({rowData: r}) => {
        const {flowId, resourceId} = useGetTableContext();

        return (
          <ErrorMessage
            message={r.message}
            errorId={r.errorId}
            flowId={flowId}
            resourceId={resourceId}
            exportDataURI={r.exportDataURI}
            importDataURI={r.importDataURI}
      />
        );
      },
    },
    {
      heading: 'Code',
      Value: ({rowData: r}) => <TextOverflowCell message={r.code} />,
      width: '15%',
    },
    {
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
      width: '15%',
    },
    {
      HeaderValue: () => {
        const tableContext = useGetTableContext();

          <SelectDate {...tableContext} />;
      },
      width: '15%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.occurredAt} />,
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
