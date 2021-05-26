import React from 'react';
import Retry from '../actions/Retry';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import ViewHttpRequest from '../actions/ViewHttpRequest';
import ViewHttpResponse from '../actions/ViewHttpResponse';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import TextOverflowCell from '../../../TextOverflowCell';
import SelectSource from '../cells/SelectSource';
import SelectDate from '../cells/SelectDate';
import { useGetTableContext } from '../../../CeligoTable/TableContext';
import EditRetryData from '../actions/EditRetry';

const options = {allowedTags: ['a']};
export default {
  rowKey: 'errorId',
  useColumns: () => [
    {
      key: 'selectAll',
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
      key: 'message',
      heading: 'Message',
      width: '25%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.message} rawHtmlOptions={options} containsHtml />,
    },
    {
      key: 'code',
      heading: 'Code',
      width: '18%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.code} />,
    },
    {
      key: 'selectResource',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectSource {...tableContext} />;
      },
      width: '10%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
    },
    {
      key: 'selectDate',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return <SelectDate {...tableContext} />;
      },
      width: '12%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.occurredAt} />,
    },
    {
      key: 'resolvedBy',
      heading: 'Resolved by',
      width: '12%',
      Value: ({rowData: r}) => {
        const {flowId} = useGetTableContext();

        return <UserName userId={r.resolvedBy} flowId={flowId} />;
      },
    },
    {
      key: 'resolvedAt',
      HeaderValue: () => {
        const tableContext = useGetTableContext();

        return (
          <SelectDate
            {...tableContext}
            title="Resolved at"
            filterBy="resolvedAt" />
        );
      },
      width: '12%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.resolvedAt} />,
    },
  ],
  useRowActions: ({ retryDataKey, reqAndResKey }) => {
    const {actionInProgress} = useGetTableContext();
    const actions = [];

    if (actionInProgress) return actions;

    if (retryDataKey) {
      actions.push(Retry);
    }
    actions.push(ViewErrorDetails);
    if (retryDataKey) {
      actions.push(EditRetryData);
    }
    if (reqAndResKey) {
      actions.push(ViewHttpRequest, ViewHttpResponse);
    }

    return actions;
  },
};
