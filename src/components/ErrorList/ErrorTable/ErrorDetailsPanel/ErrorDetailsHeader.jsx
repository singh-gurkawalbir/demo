import { Typography } from '@material-ui/core';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import clsx from 'clsx';
import React, {useCallback} from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import useHandeNextAndPreviousPage from '../../../../hooks/useHandleNextAndPreviousPage';
import TextButton from '../../../Buttons/TextButton';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import { useEditRetryConfirmDialog } from '../hooks/useEditRetryConfirmDialog';
import { useHandleNextAndPreviousErrorPage } from '../hooks/useHandleNextAndPreviousErrorPage';

export default function ErrorDetailsHeader({
  errorsInPage,
  activeErrorId,
  flowId,
  isResolved,
  resourceId,
  filterKey = 'openErrors',
  retryId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const showRetryDataChangedConfirmDialog = useEditRetryConfirmDialog({flowId, resourceId, retryId});

  const indexOfCurrentError = errorsInPage.findIndex(e => e.errorId === activeErrorId);

  const {
    errorObj,
    paginationOptions,
    currPage,
    rowsPerPage,
    handleChangePage,
  } = useHandleNextAndPreviousErrorPage({flowId, resourceId, isResolved, filterKey});
  const count = errorObj.errors.length;
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
      dispatch(actions.patchFilter('openErrors', {activeErrorId: errorsInPage?.[newIndex]?.errorId}));
    };

    showRetryDataChangedConfirmDialog(onCancelFunction);
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentError, currPage, rowsPerPage, dispatch, errorsInPage, handlePrevPage]);

  const handleNextError = useCallback(() => {
    const onCancelFunction = () => {
      let newIndex = indexOfCurrentError + 1;

      if (indexOfCurrentError === errorsInPage.length - 1) {
        handleNextPage();
        newIndex = 0;
      }

      if (indexOfCurrentError === (currPage + 1) * rowsPerPage - 1) {
        handleNextPage();
      }
      dispatch(actions.patchFilter('openErrors', {activeErrorId: errorsInPage?.[newIndex]?.errorId}));
    };

    showRetryDataChangedConfirmDialog(onCancelFunction);
  }, [showRetryDataChangedConfirmDialog, indexOfCurrentError, errorsInPage, currPage, rowsPerPage, dispatch, handleNextPage]);

  const disabledPrevious = currPage === 0 && indexOfCurrentError === 0;

  return (
    <Typography variant="h4" className={classes.title}>
      <span className={classes.label}>Error details</span>
      <TextButton
        onClick={handlePreviousError}
        className={classes.arrowBtn}
        disabled={disabledPrevious}
        startIcon={<ArrowLeftIcon />}
        >
        <span className={classes.label}>Previous</span>
      </TextButton>
      <TextButton
        onClick={handleNextError}
        className={clsx(classes.arrowBtn, classes.arrowBtnRight)}
        disabled={disableNextPage}
        endIcon={<ArrowRightIcon />}
        >
        <span className={classes.label}>Next</span>
      </TextButton>
    </Typography>
  );
}
