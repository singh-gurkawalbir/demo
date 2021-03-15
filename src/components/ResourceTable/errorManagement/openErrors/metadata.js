import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Retry from '../actions/Retry';
import Resolve from '../actions/Resolve';
import ViewErrorDetails from '../actions/ViewErrorDetails';
import EditRetryData from '../actions/EditRetry';
import DownloadRetryData from '../actions/DownloadRetry';
import SelectError from '../cells/SelectError';
import SelectAllErrors from '../cells/SelectAllErrors';
import MultiSelectColumnFilter from '../../commonCells/MultiSelectColumnFilter';
import DateFilter from '../../commonCells/DateFilter';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import TextOverflowCell from '../../../TextOverflowCell';
import ErrorMessage from '../cells/ErrorMessage';
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
      width: '15%',
    },
    {
      headerValue: function SelectOpenSource(r, { flowId, resourceId, isResolved }) {
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
      value: r => <TextOverflowCell message={r.source} />,
      width: '15%',
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
      width: '15%',
      value: r => <CeligoTimeAgo date={r.occurredAt} />,
    },
  ],
  rowActions: ({retryDataKey, source}, { actionInProgress }) => {
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

    return actions;
  },
};
