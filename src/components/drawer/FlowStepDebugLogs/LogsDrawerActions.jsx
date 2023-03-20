import React, { useCallback, useMemo } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import moment from 'moment';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionGroup from '../../ActionGroup';
import StartDebugEnhanced from '../../StartDebugEnhanced';
import CeligoPagination from '../../CeligoPagination';
import RefreshIcon from '../../icons/RefreshIcon';
import { FILTER_KEY, DEFAULT_ROWS_PER_PAGE } from '../../../utils/flowStepLogs';
import FetchProgressIndicator from '../../FetchProgressIndicator';
import { TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  refreshLogsButton: {
    marginRight: theme.spacing(-2),
  },
}));
const emptyObj = {};

export default function LogsDrawerActions({ flowId, resourceId, resourceType }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const canEnableDebug = useSelector(state => selectors.canEnableDebug(state, resourceId, flowId));
  const { hasMore, logsCount, logsStatus, loadMoreStatus, fetchStatus, currQueryTime } = useSelector(state => {
    const l = selectors.flowStepLogs(state, resourceId);

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

  const enableRefresh = useSelector(state => selectors.hasNewLogs(state, resourceId));

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
      dispatch(actions.logs.flowStep.request({flowId, resourceId, loadMore}));
    },
    [dispatch, resourceId, flowId]
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
    dispatch(actions.logs.flowStep.startDebug(flowId, resourceId, resourceType, value));
  }, [dispatch, flowId, resourceId, resourceType]);

  const stopDebugHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.stopDebug(flowId, resourceId, resourceType));
  }, [dispatch, flowId, resourceId, resourceType]);

  const pauseHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.setFetchStatus(resourceId, 'paused'));
    dispatch(actions.logs.flowStep.pauseFetch(flowId, resourceId));
  }, [dispatch, resourceId, flowId]);

  const resumeHandler = useCallback(() => {
    dispatch(actions.logs.flowStep.request({flowId, resourceId, loadMore: true}));
  }, [dispatch, resourceId, flowId]);

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
          resourceId={resourceId}
          resourceType={resourceType}
          startDebugHandler={startDebugHandler}
          stopDebugHandler={stopDebugHandler} />
        <TextButton
          onClick={refreshLogs}
          data-test="refreshLogs"
          className={classes.refreshLogsButton}
          disabled={!enableRefresh}
          startIcon={<RefreshIcon />}
           >
          Refresh logs
        </TextButton>
      </ActionGroup>
    </>
  );
}
