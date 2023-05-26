import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import clsx from 'clsx';
import React from 'react';
import { useSelector } from 'react-redux';
import { FILTER_KEYS } from '../../../../utils/errorManagement';
import TextButton from '../../../Buttons/TextButton';
import ArrowLeftIcon from '../../../icons/ArrowLeftIcon';
import ArrowRightIcon from '../../../icons/ArrowRightIcon';
import Spinner from '../../../Spinner';
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
  const classes = useStyles();

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
    </ActionGroup>
  );
}
