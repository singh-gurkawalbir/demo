import { Typography } from '@mui/material';
import React from 'react';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
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
    <Typography variant="h4" >
      <TextButton
        onClick={handlePreviousError}
        disabled={disabledPrevious}
        startIcon={<ArrowLeftIcon />}
        data-test="previousError">
        <span >Previous</span>
      </TextButton>
      <TextButton
        onClick={handleNextError}
        disabled={disableNext || loading}
        endIcon={loading ? (<Spinner size="small" />) : <ArrowRightIcon />}
        data-test="nextError">
        <span >Next</span>
      </TextButton>
    </Typography>
  );
}
