import React, { useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import { Spinner } from '@celigo/fuse-ui';
import ResourceTable from '../../ResourceTable';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import PreviewLogDetails from './PreviewLogDetails';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { FILTER_KEY } from '../../../utils/flowStepLogs';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  listContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  noResultColumn: {
    gridTemplateColumns: '1fr',
  },
  tableWrapper: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
    overflowY: 'auto',
    minWidth: '560px',
    [theme.breakpoints.down('lg')]: {
      minWidth: 'unset',
    },
  },
  textWrapper: {
    padding: theme.spacing(2),
  },
  previewWrapper: {
    position: 'relative',
    padding: theme.spacing(3, 2),
  },
  tableHeaderWithSpinner: {
    position: 'relative',
    top: 45,
    height: '100%',
  },
}));

export default function LogsTable({ flowId, resourceType, resourceId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const debugUntil = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);
    const {debugUntil} = resource || {};

    if (!debugUntil) {
      return;
    }
    if (moment().isAfter(moment(debugUntil))) {
      return;
    }

    return debugUntil;
  });
  const { hasNextPage, logsStatus, fetchStatus } = useSelector(state => {
    const l = selectors.flowStepLogs(state, resourceId);

    return {
      hasNextPage: !!l.nextPageURL,
      logsStatus: l.logsStatus,
      fetchStatus: l.fetchStatus,
    };
  }, shallowEqual);

  const hasDebugLogs = useSelector(state => !!selectors.logsSummary(state, resourceId).length);
  const logsInCurrPage = useSelectorMemo(selectors.mkLogsInCurrPageSelector, resourceId);
  const currPageFirstKey = logsInCurrPage[0]?.key;

  useEffect(() => () => {
    dispatch(actions.logs.flowStep.clear(resourceId));
    dispatch(actions.clearFilter(FILTER_KEY));
  }, [dispatch, resourceId]);

  useEffect(() => {
    dispatch(actions.logs.flowStep.request({flowId, resourceId}));
    if (debugUntil) {
      dispatch(actions.logs.flowStep.startLogsPoll(flowId, resourceId));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // set the first key on the current page as default when user navigates b/w pages
    if (currPageFirstKey) {
      dispatch(actions.logs.flowStep.setActiveLog(resourceId, currPageFirstKey));
    }
  }, [currPageFirstKey, dispatch, resourceId]);

  const actionProps = useMemo(() => ({ flowId, resourceId, isImport: resourceType === 'imports' }), [resourceId, flowId, resourceType]);

  if (!logsStatus || logsStatus === 'requested') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <>
      <div
        className={clsx(classes.listContainer, {
          [classes.noResultColumn]: !hasDebugLogs,
        })}>
        <div className={classes.tableWrapper}>
          <ResourceTable
            resources={logsInCurrPage}
            resourceType="flowStepLogs"
            actionProps={actionProps} />
          {!hasDebugLogs && !hasNextPage && (
          <Typography className={classes.textWrapper}>
            {message.NO_DEBUG_LOG}
          </Typography>
          )}
          {!hasDebugLogs && hasNextPage && fetchStatus === 'inProgress' && (
            <div className={classes.tableHeaderWithSpinner}>
              <Spinner center="screen" />
            </div>
          )}
        </div>
        {hasDebugLogs && (
          <div className={classes.previewWrapper}>
            <PreviewLogDetails flowId={flowId} resourceId={resourceId} />
          </div>
        )}
      </div>
    </>
  );
}
