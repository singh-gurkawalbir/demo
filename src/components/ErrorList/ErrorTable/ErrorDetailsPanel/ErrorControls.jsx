import React from 'react';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { useSelector } from 'react-redux';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import SplitViewErrorActions from './SplitViewErrorActions';
import { useHandleNextAndPreviousError } from '../hooks/useHandleNextAndPreviousError';
import { selectors } from '../../../../reducers';
import ActionGroup from '../../../ActionGroup';

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
  isSplitView = false,
}) {
  const sourceOfError = useSelector(state =>
    selectors.resourceError(state, {
      flowId,
      resourceId,
      errorId: activeErrorId,
      isResolved,
    })?.source
  );

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

  const showErrorActions = isSplitView && retryId && sourceOfError === 'ftp_bridge';

  return (
    <ActionGroup>
      { showErrorActions && <SplitViewErrorActions flowId={flowId} retryDataKey={retryId} resourceId={resourceId} />}
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
    </ActionGroup>
  );
}
