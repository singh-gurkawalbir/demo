import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import actions from '../../../actions';
import DateFilter from '../commonCells/DateFilter';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import { LISTENER_LOGS_RANGE_FILTERS, FILTER_KEY, LISTENER_LOGS_STATUS_CODES } from '../../../utils/listenerLogs';
import TrashIcon from '../../icons/TrashIcon';
import IconTextButton from '../../IconTextButton';

const useStyles = makeStyles(theme => ({
  textColor: {
    color: theme.palette.primary.main,
  },

}));

export default {
  columns: [
    {
      headerValue: function SelectTimestamp(_, {flowId, exportId}) {
        const dispatch = useDispatch();
        const handleChange = useCallback(() => {
          dispatch(actions.logs.listener.request(flowId, exportId));
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
            showTime />
        );
      },
      value: function LogDetailsLink(log, {exportId}) {
        const classes = useStyles();
        const dispatch = useDispatch();
        const handleActionClick = useCallback(() => {
          dispatch(actions.logs.listener.setActiveLog(exportId, log.key));
        }, [dispatch, exportId, log.key]);

        return (
          <IconTextButton
            className={classes.textColor}
            onClick={handleActionClick}>
            <CeligoTimeAgo date={log.utcDateTime} />
          </IconTextButton>
        );
      },
    },
    {
      heading: 'Method',
      value: log => log.method,
    },
    {
      headerValue: function SelectResponseCode(_, { flowId, exportId }) {
        const dispatch = useDispatch();
        const handleSave = useCallback(() => {
          dispatch(actions.logs.listener.request(flowId, exportId));
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
      value: log => log.statusCode,
    },
  ],
  rowActions: (log, {flowId, exportId}) => ([
    {
      icon: TrashIcon,
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
