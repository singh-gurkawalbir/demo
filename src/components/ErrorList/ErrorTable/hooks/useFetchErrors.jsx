import { useEffect, useCallback, useMemo} from 'react';
import { useDispatch, useSelector, shallowEqual} from 'react-redux';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { DEFAULT_FILTERS, DEFAULT_ROWS_PER_PAGE } from '../../../../utils/errorManagement';

const emptyObj = {};

export const useFetchErrors = ({
  filterKey,
  flowId,
  resourceId,
  isResolved,
  flowJobId,
  childJob,
}) => {
  const dispatch = useDispatch();

  return useCallback(
    loadMore => {
      if (!loadMore) {
        dispatch(actions.clearFilter(filterKey));
        let defaultFilter = isResolved ? DEFAULT_FILTERS.RESOLVED : DEFAULT_FILTERS.OPEN;

        if (flowJobId && childJob) {
          const occuredAt = {startDate: childJob.parentStartedAt, endDate: childJob.endedAt || new Date().toISOString(), preset: 'custom'};
          const resolvedAt = {startDate: childJob.parentStartedAt, endDate: new Date().toISOString(), preset: 'custom'};

          if (isResolved) {
            defaultFilter = {...defaultFilter, resolvedAt, flowJobId};
          } else {
            defaultFilter = {...defaultFilter, occuredAt, flowJobId};
          }
        }

        dispatch(actions.patchFilter(filterKey, defaultFilter));
      }
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          flowJobId,
          resourceId,
          loadMore,
          isResolved,
        })
      );
    },
    [childJob, dispatch, filterKey, flowId, flowJobId, isResolved, resourceId]
  );
};
const emptySet = [];

export default function FetchErrorsHook({
  filterKey,
  flowId,
  resourceId,
  isResolved,
  flowJobId,
}) {
  const dispatch = useDispatch();

  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);
  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);
  const childJob = useSelector(
    state => selectors.filter(state, `${flowId}-${flowJobId}-${resourceId}`), shallowEqual
  );

  if (!errorObj.errors) {
    errorObj.errors = emptySet;
  }

  const errorFilter = useSelector(
    state => selectors.filter(state, filterKey), shallowEqual
  );
  const { rowsPerPage = DEFAULT_ROWS_PER_PAGE } = errorFilter.paging || emptyObj;

  const fetchErrors = useFetchErrors({
    filterKey,
    flowId,
    resourceId,
    isResolved,
    flowJobId,
    childJob,
  });

  useEffect(() => {
    if (!errorObj.status ||
      (flowJobId && errorFilter.flowJobId !== flowJobId)) {
      fetchErrors();
    }

    if (
      errorObj.status === 'received' &&
              !errorObj.errors.length &&
              errorObj.outdated &&
              errorObj.nextPageURL
    ) {
      // fetch more errors
      fetchErrors(true);
    }
  }, [
    errorObj.nextPageURL,
    errorObj.errors.length,
    errorObj.outdated,
    fetchErrors,
    errorObj.status,
    flowJobId,
    errorFilter.flowJobId]);

  useEffect(() => {
    dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...errorFilter.paging,
          currPage: 0,
        },
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, errorFilter.keyword]);

  useEffect(() => {
    // dispatch an action to deselect everything
    dispatch(
      actions.errorManager.flowErrorDetails.deselectAll({
        flowId,
        resourceId,
        isResolved,
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorFilter.keyword]);

  return null;
}
