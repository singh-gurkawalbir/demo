import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import useHandeNextAndPreviousPage from '../../../../hooks/useHandleNextAndPreviousPage';
import { selectors } from '../../../../reducers';
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
  const allErrors = useSelector(state => {
    const allErrorDetails = selectors.allResourceErrorDetails(state, { flowId, resourceId, isResolved });

    return allErrorDetails.errors || [];
  });
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, retryId});
  const indexOfCurrentError = errorsInPage?.findIndex(e => e.errorId === activeErrorId);
  const indexOfCurrentErrorInAllErrors = allErrors?.findIndex(e => e.errorId === activeErrorId);
  const {
    count,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
  } = useHandleNextAndPreviousErrorPage({flowId, resourceId, isResolved, filterKey});

  const {disableNextPage, handlePrevPage, handleNextPage} = useHandeNextAndPreviousPage({
    count,
    rowsPerPage,
    page: currPage,
    onChangePage: handleChangePage,
    ...paginationOptions,
  });

  const handlePreviousError = useCallback(() => {
    const onCancelFunction = () => {
      if (indexOfCurrentErrorInAllErrors <= 0 && currPage === 0) return;
      let newIndex = indexOfCurrentErrorInAllErrors - 1;

      if (indexOfCurrentError === 0) {
        handlePrevPage();

        newIndex = indexOfCurrentErrorInAllErrors - 1;
      } else if (indexOfCurrentError === currPage * rowsPerPage) {
        handlePrevPage();
      }
      const newErrorId = allErrors?.[newIndex]?.errorId;

      dispatch(actions.patchFilter('openErrors', {
        activeErrorId: newErrorId,
        currentNavItem: newErrorId,
      }));
      typeof handlePrev === 'function' && handlePrev(newErrorId);
    };

    showRetryDataChangedConfirmDialog(onCancelFunction);
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentErrorInAllErrors, currPage, indexOfCurrentError, rowsPerPage, allErrors, dispatch, handlePrev, handlePrevPage]);

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
    disableNext: disableNextPage && (indexOfCurrentError >= errorsInPage?.length - 1),
  };
};
