import React, { useCallback, useMemo } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import moment from 'moment';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionGroup from '../../ActionGroup';
import StartDebugEnhanced from '../../StartDebugEnhanced';
import CeligoPagination from '../../CeligoPagination';
import IconTextButton from '../../IconTextButton';
import RefreshIcon from '../../icons/RefreshIcon';
import { FILTER_KEY, DEFAULT_ROWS_PER_PAGE } from '../../../utils/flowStepLogs';
import FetchProgressIndicator from '../../FetchProgressIndicator';

const useStyles = makeStyles(theme => ({
  refreshLogsButton: {
    marginRight: theme.spacing(-2),
  },
}));
const emptyObj = {};

export default function LogsDrawerActions({ flowId, exportId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const canEnableDebug = useSelector(state => selectors.canEnableDebug(state, exportId, flowId));
  const { hasMore, logsCount, logsStatus, loadMoreStatus, fetchStatus, currQueryTime } = useSelector(state => {
    const l = selectors.listenerLogs(state, exportId);

    return {
      hasMore: !!l.nextPageURL,
      logsCount: l.logsSummary?.length,
      logsStatus: l.logsStatus,
      loadMoreStatus: l.loadMoreStatus,
      fetchStatus: l.fetchStatus,
      currQueryTime: l.currQueryTime,
    };
  }, shallowEqual);

  const filterOptions = useSelector(state => selectors.filter(state, FILTER_KEY));
  const { currPage = 0 } = filterOptions.paging || emptyObj;

  // used to determine fetch progress percentage
  const {startTime, endTime} = useMemo(() => {
    const hasCodesFilter = filterOptions.codes?.length && !(filterOptions.codes?.length === 1 && filterOptions.codes?.[0] === 'all');
    const {startDate, endDate} = filterOptions.time || {};

    return {
      startTime: startDate ? startDate.getTime() : (hasCodesFilter && moment().subtract(29, 'days').startOf('day').toDate()
        .getTime()),
      endTime: endDate ? endDate.getTime() : null,
    };
  }, [filterOptions.codes, filterOptions.time]);

  const enableRefresh = useSelector(state => selectors.hasNewLogs(state, exportId));

  const handleChangePage = useCallback(
    (e, newPage) => {
      dispatch(
        actions.patchFilter(FILTER_KEY, {
          paging: {
            ...filterOptions.paging,
            currPage: newPage,
          },
        })
      );
    },
    [dispatch, filterOptions.paging]
  );

  const fetchLogs = useCallback(
    loadMore => {
      if (!loadMore) {
        dispatch(actions.clearFilter(FILTER_KEY));
      }
      dispatch(actions.logs.flowStep.request({flowId, exportId, loadMore}));
    },
    [dispatch, exportId, flowId]
  );

  const fetchMoreLogs = useCallback(() => fetchLogs(true), [fetchLogs]);
  const refreshLogs = useCallback(() => fetchLogs(), [fetchLogs]);

  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreLogs,
      hasMore,
      loading: loadMoreStatus === 'requested',
    }),
    [hasMore, loadMoreStatus, fetchMoreLogs]
  );

  const startDebugHandler = useCallback(value => {
    dispatch(actions.logs.flowStep.startDebug(flowId, exportId, value));
  }, [dispatch, flowId, exportId]);

  const stopDebugHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.stopDebug(flowId, exportId));
  }, [dispatch, flowId, exportId]);

  const pauseHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.setFetchStatus(exportId, 'paused'));
    dispatch(actions.logs.flowStep.pauseFetch(flowId, exportId));
  }, [dispatch, exportId, flowId]);

  const resumeHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.request({flowId, exportId, loadMore: true}));
  }, [dispatch, exportId, flowId]);

  return (
    <>
      <ActionGroup>
        {logsCount && logsStatus !== 'requested' ? (
          <CeligoPagination
            {...paginationOptions}
            count={logsCount}
            page={currPage}
            rowsPerPage={DEFAULT_ROWS_PER_PAGE}
            onChangePage={handleChangePage} />
        ) : null}
        <FetchProgressIndicator
          fetchStatus={fetchStatus}
          currTime={currQueryTime}
          startTime={startTime}
          endTime={endTime}
          pauseHandler={pauseHandler}
          resumeHandler={resumeHandler}
           />
      </ActionGroup>

      <ActionGroup position="right">
        <StartDebugEnhanced
          disabled={!canEnableDebug}
          resourceId={exportId}
          resourceType="exports"
          startDebugHandler={startDebugHandler}
          stopDebugHandler={stopDebugHandler} />
        <IconTextButton
          onClick={refreshLogs}
          data-test="refreshLogs"
          className={classes.refreshLogsButton}
          disabled={!enableRefresh} >
          <RefreshIcon />
          Refresh logs
        </IconTextButton>
      </ActionGroup>
    </>
  );
}
