import React, { useCallback, useMemo } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import ActionGroup from '../../ActionGroup';
import StartDebugEnhanced from '../../StartDebugEnhanced';
import CeligoPagination from '../../CeligoPagination';
import IconTextButton from '../../IconTextButton';
import RefreshIcon from '../../icons/RefreshIcon';
import { FILTER_KEY, DEFAULT_ROWS_PER_PAGE } from '../../../utils/listenerLogs';

const emptyObj = {};

export default function LogsDrawerActions({ flowId, exportId }) {
  const dispatch = useDispatch();
  const canEnableDebug = useSelector(state => selectors.canEnableDebug(state, exportId, flowId));
  const { hasMore, logsLength, logsStatus } = useSelector(state => {
    const l = selectors.listenerLogs(state, exportId);

    return {
      hasMore: l.nextPageURL,
      logsLength: l.logsSummary?.length,
      logsStatus: l.logsStatus,
    };
  }, shallowEqual);
  const filterOptions = useSelector(state => selectors.filter(state, FILTER_KEY), shallowEqual);
  const { currPage = 0 } = filterOptions.paging || emptyObj;

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
      dispatch(actions.logs.listener.request(flowId, exportId, loadMore));
    },
    [dispatch, exportId, flowId]
  );
  const fetchMoreLogs = useCallback(() => fetchLogs(true), [fetchLogs]);
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreLogs,
      hasMore,
      loading: logsStatus === 'requested',
    }),
    [hasMore, logsStatus, fetchMoreLogs]
  );

  const startDebugHandler = useCallback(value => {
    dispatch(actions.logs.listener.startDebug(flowId, exportId, value));
  }, [dispatch, flowId, exportId]);
  const stopDebugHandler = useCallback(() => {
    dispatch(actions.logs.listener.stopDebug(flowId, exportId));
  }, [dispatch, flowId, exportId]);

  return (
    <>
      {logsLength ? (
        <ActionGroup>
          <CeligoPagination
            {...paginationOptions}
            count={logsLength}
            page={currPage}
            rowsPerPage={DEFAULT_ROWS_PER_PAGE}
            onChangePage={handleChangePage} />
        </ActionGroup>
      ) : null}

      <ActionGroup position="right">
        <StartDebugEnhanced
          disabled={!canEnableDebug}
          resourceId={exportId}
          resourceType="exports"
          startDebugHandler={startDebugHandler}
          stopDebugHandler={stopDebugHandler} />
        <IconTextButton
          onClick={fetchLogs}
          ata-test="refreshLogs"
          disabled={!enableRefresh} >
          <RefreshIcon />
          Refresh logs
        </IconTextButton>
      </ActionGroup>
    </>
  );
}
