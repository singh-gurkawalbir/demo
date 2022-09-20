import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import useHandeNextAndPreviousPage from '../../../../hooks/useHandleNextAndPreviousPage';
import { selectors } from '../../../../reducers';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import { useEditRetryConfirmDialog } from './useEditRetryConfirmDialog';
import { useHandleNextAndPreviousErrorPage } from './useHandleNextAndPreviousErrorPage';

export const useHandleNextAndPreviousError = ({
  errorsInPage,
  activeErrorId,
  flowId,
  isResolved,
  resourceId,
  filterKey = FILTER_KEYS.OPEN,
  handlePrev,
  handleNext,
}) => {
  const dispatch = useDispatch();
  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.resourceFilteredErrorDetails(state, { flowId, resourceId, isResolved });

    return allErrorDetails.errors || [];
  }, shallowEqual);

  const indexOfCurrentError = errorsInPage?.findIndex(e => e.errorId === activeErrorId);
  const indexOfCurrentErrorInAllErrors = allErrors?.findIndex(e => e.errorId === activeErrorId);

  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, isResolved});

  const {
    count,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
  } = useHandleNextAndPreviousErrorPage({
    flowId,
    resourceId,
    isResolved,
    filterKey,
  });

  const {
    disableNextPage,
    handlePrevPage,
    handleNextPage,
  } = useHandeNextAndPreviousPage({
    count,
    rowsPerPage,
    page: currPage,
    onChangePage: handleChangePage,
    ...paginationOptions,
  });

  const handlePreviousError = useCallback(() => {
    showRetryDataChangedConfirmDialog(() => {
      if (indexOfCurrentErrorInAllErrors <= 0 && currPage === 0) return;
      const newIndex = indexOfCurrentErrorInAllErrors - 1;

      if (indexOfCurrentError === 0 || indexOfCurrentError === currPage * rowsPerPage) {
        handlePrevPage();
      }

      const newErrorId = allErrors?.[newIndex]?.errorId;

      dispatch(actions.patchFilter(filterKey, {
        activeErrorId: newErrorId,
      }));

      typeof handlePrev === 'function' && handlePrev(newErrorId);
    });
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentErrorInAllErrors, currPage, indexOfCurrentError, rowsPerPage, allErrors, dispatch, filterKey, handlePrev, handlePrevPage]);

  const handleNextError = useCallback(isSave => {
    showRetryDataChangedConfirmDialog(() => {
      if (!allErrors || !Array.isArray(allErrors)) return;

      const newIndex = allErrors.findIndex(e => e.errorId === activeErrorId) + 1;

      if (indexOfCurrentError === errorsInPage?.length - 1 || indexOfCurrentError === (currPage + 1) * rowsPerPage - 1) {
        handleNextPage();
      }

      const newErrorId = allErrors?.[newIndex]?.errorId;

      if (!newErrorId) return;

      dispatch(actions.patchFilter(FILTER_KEYS.OPEN, {
        activeErrorId: newErrorId,
      }));

      typeof handleNext === 'function' && handleNext(newErrorId);
    }, isSave);
  }, [showRetryDataChangedConfirmDialog, allErrors, indexOfCurrentError, errorsInPage?.length, currPage, rowsPerPage, dispatch, handleNext, activeErrorId, handleNextPage]);

  const disabledPrevious = currPage === 0 && indexOfCurrentError === 0;

  return {
    handleNextError,
    handlePreviousError,
    disabledPrevious,
    disableNext: disableNextPage && (indexOfCurrentError >= errorsInPage?.length - 1),
    loading: paginationOptions.loading,
  };
};
