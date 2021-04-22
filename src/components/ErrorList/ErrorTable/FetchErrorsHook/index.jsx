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
}) => {
  const dispatch = useDispatch();
  const defaultFilter = isResolved => isResolved ? DEFAULT_FILTERS.RESOLVED : DEFAULT_FILTERS.OPEN;

  return useCallback(
    loadMore => {
      if (!loadMore) {
        dispatch(actions.clearFilter(filterKey));
        dispatch(actions.patchFilter(filterKey, defaultFilter));
      }
      dispatch(
        actions.errorManager.flowErrorDetails.request({
          flowId,
          resourceId,
          loadMore,
          isResolved,
        })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, flowId, resourceId, isResolved, filterKey]
  );
};
const emptySet = [];

export default function FetchErrorsHook({
  filterKey,
  flowId,
  resourceId,
  isResolved,
}) {
  const dispatch = useDispatch();

  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);
  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);

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
  });

  useEffect(() => {
    if (!errorObj.status) {
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
  ]);

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
