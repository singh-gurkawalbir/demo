import React from 'react';
import Retry from '../actions/Retry';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import OverflowWrapper from '../cells/OverflowWrapper';
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
      width: '30%',
      value: r => <OverflowWrapper message={r.message} containsHtml />,
    },
    {
      heading: 'Code',
      width: '20%',
      value: r => <OverflowWrapper message={r.code} />,
    },
    {
      headerValue: function SelectResolvedSource(r, actionProps) {
        return <SelectSource {...actionProps} />;
      },
      width: '10%',
      value: r => <OverflowWrapper message={r.source} />,
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
        return <SelectDate {...actionProps} title="Resolved at" />;
      },
      width: '12%',
      value: r => <CeligoTimeAgo date={r.resolvedAt} />,
    },
  ],
  rowActions: ({ retryDataKey }, { actionInProgress }) => {
    const actions = [];

    if (actionInProgress) return actions;

    if (retryDataKey) {
      actions.push(Retry);
    }
    actions.push(ViewErrorDetails);

    return actions;
  },
};
