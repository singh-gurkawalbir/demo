import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import CeligoTimeAgo from '../../CeligoTimeAgo';
import actions from '../../../actions';
import DateFilter from '../commonCells/DateFilter';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import { LISTENER_LOGS_RANGE_FILTERS, FILTER_KEY, LISTENER_LOGS_STATUS_CODES } from '../../../utils/listenerLogs';
import TrashIcon from '../../icons/TrashIcon';
import IconTextButton from '../../IconTextButton';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  textColor: {
    color: theme.palette.primary.main,
  },
  rowClicked: {
    '&:before': {
      content: '""',
      width: 6,
      height: 'calc(100% + 20px)',
      position: 'absolute',
      left: -16,
      top: -10,
      backgroundColor: theme.palette.primary.main,
    },
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
        const activeLogKey = useSelector(state => selectors.activeLogKey(state, exportId));

        const handleActionClick = useCallback(() => {
          dispatch(actions.logs.listener.setActiveLog(exportId, log.key));
        }, [dispatch, exportId, log.key]);

        return (
          <IconTextButton
            className={clsx(classes.textColor, {
              [classes.rowClicked]: activeLogKey === log.key,
            })}
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
