import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addDays, startOfDay } from 'date-fns';
import actions from '../../../actions';
import DateFilter from '../commonCells/DateFilter';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import { FLOWSTEP_LOGS_RANGE_FILTERS, FILTER_KEY, FLOWSTEP_LOGS_STATUS_CODES, FLOWSTEP_LOGS_STAGE_OPTIONS, FLOWSTEP_LOGS_METHOD_OPTIONS } from '../../../utils/flowStepLogs';
import TrashIcon from '../../icons/TrashIcon';
import LogDetailsLink from './cells/LogDetailsLink';
import { useGetTableContext } from '../../CeligoTable/TableContext';
import useConfirmDialog from '../../ConfirmDialog';

export default {
  useColumns: () => {
    const {flowId, resourceId, isImport} = useGetTableContext();

    return [
      {
        key: 'time',
        isLoggable: true,
        HeaderValue: () => {
          const dispatch = useDispatch();
          const handleChange = useCallback(() => {
            dispatch(actions.logs.flowStep.request({flowId, resourceId}));
          },
          [dispatch],
          );

          return (
            <DateFilter
              title="Time"
              filterBy="time"
              filterKey={FILTER_KEY}
              handleChange={handleChange}
              customPresets={FLOWSTEP_LOGS_RANGE_FILTERS}
              fromDate={startOfDay(addDays(new Date(), -29))}
              showTime
              skipLastEndDate />
          );
        },
        Value: ({rowData: log}) => {
          const {resourceId} = useGetTableContext();

          return <LogDetailsLink logKey={log.key} resourceId={resourceId} time={log.utcDateTime} />;
        },
      },
      {
        key: 'method',
        isLoggable: true,
        HeaderValue: () => {
          const dispatch = useDispatch();
          const handleSave = useCallback(() => {
            dispatch(actions.logs.flowStep.request({flowId, resourceId}));
          },
          [dispatch],
          );

          return (
            <MultiSelectColumnFilter
              title="Method"
              filterBy="method"
              filterKey={FILTER_KEY}
              handleSave={handleSave}
              options={FLOWSTEP_LOGS_METHOD_OPTIONS} />
          );
        },
        Value: ({rowData: log}) => log.method,
      },
      ...(isImport
        ? [{ key: 'stage',
          HeaderValue: () => {
            const dispatch = useDispatch();
            const handleSave = useCallback(() => {
              dispatch(actions.logs.flowStep.request({flowId, resourceId}));
            },
            [dispatch],
            );

            return (
              <MultiSelectColumnFilter
                title="Stage"
                filterBy="stage"
                filterKey={FILTER_KEY}
                handleSave={handleSave}
                options={FLOWSTEP_LOGS_STAGE_OPTIONS} />
            );
          },
          Value: ({rowData: log}) => log.stage }]
        : []),
      {
        key: 'codes',
        isLoggable: true,
        HeaderValue: () => {
          const dispatch = useDispatch();
          const handleSave = useCallback(() => {
            dispatch(actions.logs.flowStep.request({flowId, resourceId}));
          },
          [dispatch],
          );

          return (
            <MultiSelectColumnFilter
              title="Response code"
              filterBy="codes"
              filterKey={FILTER_KEY}
              handleSave={handleSave}
              options={FLOWSTEP_LOGS_STATUS_CODES} />
          );
        },
        Value: ({rowData: log}) => log.statusCode,
      },
    ];
  },
  useRowActions: log => [
    {
      key: 'deleteLog',
      icon: TrashIcon,
      mode: 'delete',
      useLabel: () => 'Delete log',
      useOnClick: () => {
        const dispatch = useDispatch();

        const {flowId, resourceId} = useGetTableContext();

        const { confirmDialog } = useConfirmDialog();

        return useCallback(() => {
          const handleClick = () => {
            dispatch(actions.logs.flowStep.removeLog(flowId, resourceId, [log?.key]));
          };

          confirmDialog({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete this request?',
            buttons: [
              {
                label: 'Delete',
                error: true,
                onClick: handleClick,
              },
              {
                label: 'Cancel',
                variant: 'text',
              },
            ],
          });
        }, [confirmDialog, dispatch, resourceId, flowId]);
      },
    },
  ],

};
