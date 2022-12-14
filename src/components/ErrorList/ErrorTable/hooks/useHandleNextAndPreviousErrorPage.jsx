import { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useIsFreshLoadData } from '..';
import actions from '../../../../actions';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import { DEFAULT_ROWS_PER_PAGE } from '../../../../utils/errorManagement';
import { useEditRetryConfirmDialog } from './useEditRetryConfirmDialog';
import { useFetchErrors } from './useFetchErrors';

const emptySet = [];
const emptyObj = {};

export const useHandleNextAndPreviousErrorPage = ({
  flowId, resourceId, isResolved, filterKey, flowJobId,
}) => {
  const dispatch = useDispatch();

  const childJob = useSelector(
    state => selectors.filter(state, `${flowId}-${flowJobId}-${resourceId}`), shallowEqual
  );
  const fetchErrors = useFetchErrors({
    filterKey,
    flowId,
    resourceId,
    isResolved,
    flowJobId,
    childJob,
  });
  const errorConfig = useMemo(() => ({
    flowId,
    resourceId,
    isResolved,
  }), [isResolved, flowId, resourceId]);

  const errorObj = useSelectorMemo(selectors.mkResourceFilteredErrorDetailsSelector, errorConfig);

  const isFreshDataLoad = useIsFreshLoadData(errorConfig);
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );

  if (!errorObj.errors) {
    errorObj.errors = emptySet;
  }

  const errorFilter = useSelector(
    state => selectors.filter(state, filterKey), shallowEqual
  );
  const { currPage = 0, rowsPerPage = DEFAULT_ROWS_PER_PAGE } = errorFilter.paging || emptyObj;

  const hasErrors = useSelector(
    state => selectors.hasResourceErrors(state, { flowId, resourceId, isResolved })
  );

  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});

  const handleChangeRowsPerPage = useCallback(e => {
    showRetryDataChangedConfirmDialog(() => dispatch(
      actions.patchFilter(filterKey, {
        paging: {
          ...errorFilter.paging,
          rowsPerPage: parseInt(e.target.value, 10),
        },
      })
    ));
  }, [showRetryDataChangedConfirmDialog, dispatch, filterKey, errorFilter.paging]);

  const handleChangePage = useCallback(
    (e, newPage) => {
      showRetryDataChangedConfirmDialog(() => dispatch(
        actions.patchFilter(filterKey, {
          paging: {
            ...errorFilter.paging,
            currPage: newPage,
          },
        })
      ));
    },
    [showRetryDataChangedConfirmDialog, dispatch, filterKey, errorFilter.paging]
  );

  const paginationOptions = useMemo(
    () => ({
      // fetch more errors
      loadMoreHandler: () => fetchErrors(true),
      hasMore: !!errorObj.nextPageURL,
      loading: errorObj.status === 'requested',
    }),
    [fetchErrors, errorObj.nextPageURL, errorObj.status]
  );

  return {
    hasErrors,
    errorObj,
    count: errorObj?.errors?.length,
    retryStatus,
    fetchErrors,
    isFreshDataLoad,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};
