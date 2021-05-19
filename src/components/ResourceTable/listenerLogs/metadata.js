import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DateFilter from '../commonCells/DateFilter';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import { LISTENER_LOGS_RANGE_FILTERS, FILTER_KEY, LISTENER_LOGS_STATUS_CODES } from '../../../utils/listenerLogs';
import TrashIcon from '../../icons/TrashIcon';
import LogDetailsLink from './cells/LogDetailsLink';
import { useGetTableContext } from '../../CeligoTable/TableContext';
import useConfirmDialog from '../../ConfirmDialog';

export default {
  useColumns: () => [
    {
      key: 'time',
      HeaderValue: () => {
        const {flowId, exportId} = useGetTableContext();

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
      key: 'method',
      heading: 'Method',
      Value: ({rowData: log}) => log.method,
    },
    {
      key: 'codes',
      HeaderValue: () => {
        const {flowId, exportId} = useGetTableContext();

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
      Value: ({rowData: log}) => log.statusCode,
    },
  ],
  useRowActions: log => [
    {
      icon: TrashIcon,
      useLabel: () => 'Delete log',
      useOnClick: () => {
        const dispatch = useDispatch();

        const {flowId, exportId} = useGetTableContext();

        const { confirmDialog } = useConfirmDialog();

        return useCallback(() => {
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
        }, [confirmDialog, dispatch, exportId, flowId]);
      },
    },
  ],

};
