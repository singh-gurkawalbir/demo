import { Typography } from '@material-ui/core';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import clsx from 'clsx';
import React from 'react';
import TextButton from '../../../Buttons/TextButton';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import { useHandleNextAndPreviousError } from '../hooks/useHandleNextAndPreviousError';

export default function ErrorDetailsHeader({
  errorsInPage,
  activeErrorId,
  flowId,
  isResolved,
  resourceId,
  filterKey = 'openErrors',
  retryId,
  isDrawer,
  handlePrev,
  handleNext,
}) {
  const classes = useStyles();
  const {
    handleNextError,
    handlePreviousError,
    disabledPrevious,
    disableNext,
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
      {!isDrawer ? <span className={classes.label}>Error details</span> : null}
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
        disabled={disableNext}
        endIcon={<ArrowRightIcon />}
        >
        <span className={classes.label}>Next</span>
      </TextButton>
    </Typography>
  );
}
