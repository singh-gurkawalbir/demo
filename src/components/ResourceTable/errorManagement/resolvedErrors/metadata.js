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
      width: '25%',
      value: r => <TextOverflowCell message={r.message} containsHtml />,
    },
    {
      heading: 'Code',
      width: '18%',
      value: r => <TextOverflowCell message={r.code} />,
    },
    {
      headerValue: function SelectResolvedSource(r, actionProps) {
        return <SelectSource {...actionProps} />;
      },
      width: '10%',
      value: r => <TextOverflowCell message={r.source} />,
    },
    {
      headerValue: function SelectTimestamp(r, actionProps) {
        return <SelectDate {...actionProps} />;
      },
      width: '12%',
      value: r => <CeligoTimeAgo date={r.occurredAt} />,
    },
    {
      heading: 'Resolved by',
      width: '12%',
      value: (r, { flowId }) => <UserName userId={r.resolvedBy} flowId={flowId} />,
    },
    {
      headerValue: function SelectResolvedAt(r, actionProps) {
        return <SelectDate {...actionProps} title="Resolved at" filterBy="resolvedAt" />;
      },
      width: '12%',
      value: r => <CeligoTimeAgo date={r.resolvedAt} />,
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
