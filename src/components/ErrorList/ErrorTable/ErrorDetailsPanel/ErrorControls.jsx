import { Typography } from '@material-ui/core';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import clsx from 'clsx';
import React from 'react';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import TextButton from '../../../Buttons/TextButton';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import Spinner from '../../../Spinner';
import { useHandleNextAndPreviousError } from '../hooks/useHandleNextAndPreviousError';

export default function ErrorControls({
  errorsInPage,
  activeErrorId,
  flowId,
  isResolved,
  resourceId,
  filterKey = FILTER_KEYS.OPEN,
  retryId,
  handlePrev,
  handleNext,
}) {
  const classes = useStyles();
  const {
    handleNextError,
    handlePreviousError,
    disabledPrevious,
    disableNext,
    loading,
  } = useHandleNextAndPreviousError({
    errorsInPage,
    activeErrorId,
    flowId,
    isResolved,
    resourceId,
    filterKey,
    retryId,
    handlePrev,
    handleNext,
  });

  return (
    <Typography variant="h4" className={classes.title}>
      <TextButton
        onClick={handlePreviousError}
        className={classes.arrowBtn}
        disabled={disabledPrevious}
        startIcon={<ArrowLeftIcon />}
        data-test="previousError">
        <span className={classes.label}>Previous</span>
      </TextButton>
      <TextButton
        onClick={handleNextError}
        className={clsx(classes.arrowBtn, classes.arrowBtnRight)}
        disabled={disableNext || loading}
        endIcon={loading ? (<Spinner size="small" />) : <ArrowRightIcon />}
        data-test="nextError">
        <span className={classes.label}>Next</span>
      </TextButton>
    </Typography>
  );
}
