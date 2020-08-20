import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

export default function useErrorTableConfig(flowId, resourceId, options = {}) {
  const {filterKey, defaultFilter, show, isResolved = false } = options;
  const dispatch = useDispatch();
  const errorFilter = useSelector(
    state => selectors.filter(state, filterKey) || defaultFilter
  );
  const {
    status,
    errors = [],
    nextPageURL,
    outdated = false,
    updated = false,
  } = useSelector(state =>
    selectors.resourceErrors(state, {
      flowId,
      resourceId,
      options: { ...errorFilter, isResolved },
    })
  );
  const isAnyActionInProgress = useSelector(state =>
    selectors.isAnyErrorActionInProgress(state, {
      flowId,
      resourceId,
    })
  );
  const isFreshDataLoad = !!((!status || status === 'requested') && !nextPageURL);
  const actionProps = useMemo(
    () => ({
      filterKey,
      defaultFilter,
      resourceId,
      flowId,
      actionInProgress: isAnyActionInProgress,
      isResolved,
    }),
    [filterKey, flowId, isAnyActionInProgress, resourceId, defaultFilter, isResolved]
  );
  const fetchErrors = useCallback(
    loadMore =>
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
          isResolved,
        })
      ),
    [dispatch, flowId, resourceId, isResolved]
  );
  const fetchMoreErrors = useCallback(() => fetchErrors(true), [
    fetchErrors,
  ]);
  const paginationOptions = useMemo(
    () => ({
      loadMoreHandler: fetchMoreErrors,
      hasMore: !!nextPageURL,
      loading: status === 'requested',
    }),
    [fetchMoreErrors, nextPageURL, status]
  );

  useEffect(() => {
    if (show) {
      if (!status) {
        fetchErrors();
      }

      if (
        status === 'received' &&
        !errors.length &&
        outdated &&
        nextPageURL
      ) {
        fetchMoreErrors();
      }
    }
  }, [
    dispatch,
    fetchMoreErrors,
    flowId,
    nextPageURL,
    errors.length,
    outdated,
    fetchErrors,
    resourceId,
    show,
    status,
  ]);

  useEffect(
    () => () => {
      dispatch(
        actions.errorManager.flowErrorDetails.clear({
          flowId,
          resourceId,
          isResolved,
        })
      );
    },
    [dispatch, flowId, resourceId, isResolved]
  );

  return {
    errors,
    fetchErrors,
    updated,
    isFreshDataLoad,
    filterKey,
    paginationOptions,
    actionProps,
  };
}
