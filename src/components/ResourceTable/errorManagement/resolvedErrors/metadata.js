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

export default {
  columns: [
    {
      headerValue: function SelectAll(r, actionProps) {
        return <SelectAllErrors {...actionProps} />;
      },
      heading: 'Select All',
      Value: ({rowData: error}) => {
        const tableContext = useGetTableContext();

        return <SelectError error={error} {...tableContext} />;
      },
    },
    {
      heading: 'Message',
      width: '25%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.message} containsHtml />,
    },
    {
      heading: 'Code',
      width: '18%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.code} />,
    },
    {
      headerValue: function SelectResolvedSource(r, actionProps) {
        return <SelectSource {...actionProps} />;
      },
      width: '10%',
      Value: ({rowData: r}) => <TextOverflowCell message={r.source} />,
    },
    {
      headerValue: function SelectTimestamp(r, actionProps) {
        return <SelectDate {...actionProps} />;
      },
      width: '12%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.occurredAt} />,
    },
    {
      heading: 'Resolved by',
      width: '12%',
      Value: ({rowData: r}) => {
        const {flowId} = useGetTableContext();

        return <UserName userId={r.resolvedBy} flowId={flowId} />;
      },
    },
    {
      headerValue: function SelectResolvedAt(r, actionProps) {
        return (
          <SelectDate
            {...actionProps}
            title="Resolved at"
            filterBy="resolvedAt" />
        );
      },
      width: '12%',
      Value: ({rowData: r}) => <CeligoTimeAgo date={r.resolvedAt} />,
    },
  ],
  rowActions: ({ retryDataKey, reqAndResKey }, { actionInProgress }) => {
    const actions = [];

    if (actionInProgress) return actions;

    if (retryDataKey) {
      actions.push(Retry);
    }
    actions.push(ViewErrorDetails);
    if (reqAndResKey) {
      actions.push(ViewHttpRequest, ViewHttpResponse);
    }

    return actions;
  },
};
