import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DateFilter from '../commonCells/DateFilter';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import { LISTENER_LOGS_RANGE_FILTERS, FILTER_KEY, LISTENER_LOGS_STATUS_CODES, DEFAULT_RANGE } from '../../../utils/listenerLogs';
import TrashIcon from '../../icons/TrashIcon';

import LogDetailsLink from './cells/LogDetailsLink';
import { useGetTableContext } from '../../CeligoTable/TableContext';

export default {
  columns: [
    {
      headerValue: function SelectTimestamp(_, {flowId, exportId}) {
        const dispatch = useDispatch();
        const handleChange = useCallback(() => {
          dispatch(actions.logs.listener.request({flowId, exportId}));
        },
        [dispatch, exportId, flowId],
        );

        return (
          <DateFilter
            title="Time"
            filterBy="time"
            filterKey={FILTER_KEY}
            handleChange={handleChange}
            customPresets={LISTENER_LOGS_RANGE_FILTERS}
            defaultRange={DEFAULT_RANGE}
            showTime
            skipLastEndDate />
        );
      },
      Value: ({rowData: log}) => {
        const {exportId} = useGetTableContext();

        return <LogDetailsLink logKey={log.key} exportId={exportId} time={log.utcDateTime} />;
      },
    },
    {
      heading: 'Method',
      Value: log => log.method,
    },
    {
      headerValue: function SelectResponseCode(_, { flowId, exportId }) {
        const dispatch = useDispatch();
        const handleSave = useCallback(() => {
          dispatch(actions.logs.listener.request({flowId, exportId}));
        },
        [dispatch, exportId, flowId],
        );

        return (
          <MultiSelectColumnFilter
            title="Response code"
            filterBy="codes"
            filterKey={FILTER_KEY}
            handleSave={handleSave}
            options={LISTENER_LOGS_STATUS_CODES} />
        );
      },
      Value: log => log.statusCode,
    },
  ],
  rowActions: (log, {flowId, exportId}) => ([
    {
      icon: TrashIcon,
      useLabel: () => 'Delete log',
      onClick: (dispatch, confirmDialog) => {
        const handleClick = () => {
          dispatch(actions.logs.listener.removeLog(flowId, exportId, [log?.key]));
        };

        confirmDialog({
          title: 'Confirm delete',
          message: 'Are you sure you want to delete this request?',
          buttons: [
            {
              label: 'Delete',
              onClick: handleClick,
            },
            {
              label: 'Cancel',
              color: 'secondary',
            },
          ],
        });
      },
    },
  ]),
};
