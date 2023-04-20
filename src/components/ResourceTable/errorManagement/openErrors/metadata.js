import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import {selectors} from '../../../../reducers';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import ViewHttpRequest from '../actions/ViewHttpRequest';
import ViewHttpResponse from '../actions/ViewHttpResponse';
import EditRetryData from '../actions/EditRetry';
import DownloadRetryData from '../actions/DownloadRetry';
import SelectError from '../../../ErrorList/ErrorDetails/ErrorDetailActions/SelectError';
import SelectSource from '../cells/SelectSource';
import SelectClassification from '../cells/SelectClassification';
import SelectDate from '../cells/SelectDate';
import Classification from '../cells/Classification';
import SelectAllErrors from '../cells/SelectAllErrors';
import CodeCell from '../cells/CodeCell';
import TextOverflowCell from '../../../TextOverflowCell';
import ErrorMessage from '../cells/ErrorMessage';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import ViewNetsuiteRequest from '../actions/ViewNetsuiteRequest';
import ViewNetsuiteResponse from '../actions/ViewNetsuiteResponse';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { message } from '../../../../utils/messageStore';

export default {
  rowKey: 'errorId',
  additionalConfigs: {
    actionMenuTooltip: message.ERROR_MANAGEMENT_2.VIEW_ACTIONS_HOVER_MESSAGE,
    IsActiveRow: ({ rowData }) => {
      const errorFilter = useSelector(
        state => selectors.filter(state, FILTER_KEYS.OPEN), shallowEqual
      );

      return errorFilter?.activeErrorId === rowData.errorId;
    },
  },
  useColumns: () => [
    {
      key: 'selectAll',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectAllErrors {...tableContext} />;
      },
      heading: 'Select All',
      isLoggable: true,
      Value: ({rowData: error}) => {
        const tableContext = useGetTableContext();

        return <SelectError error={error} {...tableContext} />;
      },
    },
    {
      key: 'message',
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
      key: 'code',
      heading: 'Code',
      isLoggable: true,
      Value: ({rowData: r}) => <CodeCell message={r.code} />,
      width: '15%',
    },
    {
      key: 'selectSource',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
      width: '15%',
    },
    {
      key: 'selectClassification',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectClassification {...tableContext} />;
      },
      isLoggable: true,
      Value: ({rowData: r}) => <Classification error={r} />,
      width: '10%',
    },
    {
      key: 'selectDate',
      isLoggable: true,
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectDate {...tableContext} />;
      },
      width: '15%',
      Value: ({rowData: r}) => <TimeAgo date={r.occurredAt} />,
    },
  ],
  useRowActions: ({retryDataKey, source, reqAndResKey}) => {
    const {actionInProgress, resourceId} = useGetTableContext();
    const isResourceNetsuite = useSelector(state => selectors.isResourceNetsuite(state, resourceId));

    if (actionInProgress) return [];
    const actions = [
      ...(retryDataKey ? [EditRetryData] : []),
      Resolve,
      ...(retryDataKey ? [Retry] : []),
      ViewErrorDetails,
      // IO-19304, for errors occuring at FTP bridge, retry data returned will be metadata and not actual retry data,
      // hence show download option
      ...(retryDataKey && source === 'ftp_bridge' ? [DownloadRetryData] : []),
    ];

    if (reqAndResKey) {
      isResourceNetsuite
        ? actions.push(ViewNetsuiteRequest, ViewNetsuiteResponse)
        : actions.push(ViewHttpRequest, ViewHttpResponse);
    }

    return actions;
  },
};
