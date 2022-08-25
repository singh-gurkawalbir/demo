import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useHandeNextAndPreviousPage from '../../../../hooks/useHandleNextAndPreviousPage';
import { useEditRetryConfirmDialog } from './useEditRetryConfirmDialog';
import { useHandleNextAndPreviousErrorPage } from './useHandleNextAndPreviousErrorPage';

export const useHandleNextAndPreviousError = ({
  errorsInPage,
  activeErrorId,
  flowId,
  isResolved,
  resourceId,
  filterKey = 'openErrors',
  retryId,
  handlePrev,
  handleNext,
}) => {
  const dispatch = useDispatch();
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, retryId});

  const indexOfCurrentError = errorsInPage?.findIndex(e => e.errorId === activeErrorId);

  const {
    errorObj,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
  } = useHandleNextAndPreviousErrorPage({flowId, resourceId, isResolved, filterKey});
  const count = errorObj?.errors?.length;
  const {disableNextPage, handlePrevPage, handleNextPage} = useHandeNextAndPreviousPage({
    count,
    rowsPerPage,
    page: currPage,
    onChangePage: handleChangePage,
    ...paginationOptions,
  });

  const handlePreviousError = useCallback(() => {
    const onCancelFunction = () => {
      if (indexOfCurrentError <= 0 && currPage === 0) return;
      let newIndex = indexOfCurrentError - 1;

      if (indexOfCurrentError === 0) {
        handlePrevPage();
        newIndex = rowsPerPage - 1;
      } else if (indexOfCurrentError === currPage * rowsPerPage) {
        handlePrevPage();
      }
      const newErrorId = errorsInPage?.[newIndex]?.errorId;

      dispatch(actions.patchFilter('openErrors', {
        activeErrorId: newErrorId,
        currentNavItem: newErrorId,
      }));
      typeof handlePrev === 'function' && handlePrev(newErrorId);
    };

    showRetryDataChangedConfirmDialog(onCancelFunction);
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentError, currPage, rowsPerPage, dispatch, errorsInPage, handlePrev, handlePrevPage]);

  const handleNextError = useCallback(() => {
    const onCancelFunction = () => {
      let newIndex = indexOfCurrentError + 1;

      if (indexOfCurrentError === errorsInPage?.length - 1) {
        handleNextPage();
        newIndex = 0;
      }

      if (indexOfCurrentError === (currPage + 1) * rowsPerPage - 1) {
        handleNextPage();
      }
      const newErrorId = errorsInPage?.[newIndex]?.errorId;

      dispatch(actions.patchFilter('openErrors', {
        activeErrorId: newErrorId,
        currentNavItem: newErrorId,
      }));
      typeof handleNext === 'function' && handleNext(newErrorId);
    };

    showRetryDataChangedConfirmDialog(onCancelFunction);
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentError, errorsInPage, currPage, rowsPerPage, dispatch, handleNext, handleNextPage]);

  const disabledPrevious = currPage === 0 && indexOfCurrentError === 0;

  return {
    handleNextError,
    handlePreviousError,
    disabledPrevious,
    disableNext: disableNextPage,
  };
};
