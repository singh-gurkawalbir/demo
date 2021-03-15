import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Retry from '../actions/Retry';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import UserName from '../cells/UserName';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import TextOverflowCell from '../../../TextOverflowCell';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import DateFilter from '../../commonCells/DateFilter';
import { FILTER_KEYS, ERROR_MANAGEMENT_RANGE_FILTERS } from '../../../../utils/errorManagement';

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
      headerValue: function SelectResolvedSource(r, { flowId, resourceId, isResolved }) {
        const dispatch = useDispatch();
        const sourceOptions = useSelector(state => selectors.sourceOptions(state, resourceId));

        const handleSave = useCallback(
          () => {
            dispatch(
              actions.errorManager.flowErrorDetails.request({
                flowId,
                resourceId,
                isResolved,
              })
            );
          },
          [dispatch, flowId, isResolved, resourceId],
        );
        const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

        return (
          <MultiSelectColumnFilter
            filterKey={filterKey}
            handleSave={handleSave}
            options={sourceOptions} />
        );
      },
      width: '10%',
      value: r => <TextOverflowCell message={r.source} />,
    },
    {
      headerValue: function SelectTimestamp(r, {flowId, resourceId, isResolved}) {
        const dispatch = useDispatch();

        const handleChange = useCallback(
          () => {
            dispatch(
              actions.errorManager.flowErrorDetails.request({
                flowId,
                resourceId,
                isResolved,
              })
            );
          },
          [dispatch, flowId, isResolved, resourceId],
        );
        const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

        return (
          <DateFilter
            filterKey={filterKey}
            handleChange={handleChange}
            customPresets={ERROR_MANAGEMENT_RANGE_FILTERS} />
        );
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
      headerValue: function SelectResolvedAt(r, {flowId, resourceId, isResolved}) {
        const dispatch = useDispatch();

        const handleChange = useCallback(
          () => {
            dispatch(
              actions.errorManager.flowErrorDetails.request({
                flowId,
                resourceId,
                isResolved,
              })
            );
          },
          [dispatch, flowId, isResolved, resourceId],
        );
        const filterKey = isResolved ? FILTER_KEYS.RESOLVED : FILTER_KEYS.OPEN;

        return (
          <DateFilter
            title="Resolved at"
            filterBy="resolvedAt"
            filterKey={filterKey}
            handleChange={handleChange}
            customPresets={ERROR_MANAGEMENT_RANGE_FILTERS} />
        );
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
