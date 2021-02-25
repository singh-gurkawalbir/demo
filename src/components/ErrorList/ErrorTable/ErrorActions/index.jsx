import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import Spinner from '../../../Spinner';
import useConfirmDialog from '../../../ConfirmDialog';
import ButtonGroup from '../../../ButtonGroup';

const useStyles = makeStyles(theme => ({
  spinnerIcon: {
    marginLeft: theme.spacing(0.5),
  },
  btnActions: {
    height: 32,
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    '&:hover': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function ErrorActions(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { confirmDialog } = useConfirmDialog();
  const { flowId, resourceId, isResolved, className } = props;
  const isFlowDisabled = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?.disabled
  );
  const isRetryInProgress = useSelector(
    state =>
      selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
        .status === 'requested'
  );
  const isResolveInProgress = useSelector(
    state =>
      !isResolved &&
      selectors.errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
        .status === 'requested'
  );
  const isActionInProgress = useMemo(
    () => isRetryInProgress || isResolveInProgress,
    [isResolveInProgress, isRetryInProgress]
  );
  const areSelectedErrorsRetriable = useSelector(
    state =>
      !!selectors.selectedRetryIds(state, {
        flowId,
        resourceId,
        options: { isResolved },
      }).length
  );
  const isAtleastOneErrorSelected = useSelector(
    state =>
      !!selectors.selectedErrorIds(state, {
        flowId,
        resourceId,
        options: { isResolved },
      }).length
  );
  const retryErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
        isResolved,
      })
    );
  }, [dispatch, flowId, isResolved, resourceId]);
  const handleResolve = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      })
    );
  }, [dispatch, flowId, resourceId]);

  // selector to return count of selected errors
  // selector to return total count of errors without filter

  const handleRetry = useCallback(() => {
    if (!isResolved) {
      return retryErrors();
    }
    // show confirmation dialog for resolved errors trying to be retried
    confirmDialog({
      title: 'Confirm retry',
      message: 'You are requesting to retry one or more errors that have been resolved. The retry data associated with these errors represents the data at the time of the original error, and could be older and/or out of date. Please confirm you would like to proceed.',
      buttons: [
        {
          label: 'Retry',
          onClick: () => {
            retryErrors();
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [isResolved, retryErrors, confirmDialog]);

  return (
    <div className={className}>
      <ButtonGroup>
        {!isResolved && (
        <Button
          variant="outlined"
          color="secondary"
          className={classes.btnActions}
          disabled={!isAtleastOneErrorSelected || isActionInProgress}
          onClick={handleResolve}>
          Resolve{isResolveInProgress ? <Spinner size={16} className={classes.spinnerIcon} /> : null}
        </Button>
        )}

        <Button
          variant="outlined"
          color="secondary"
          className={classes.btnActions}
          disabled={!areSelectedErrorsRetriable || isActionInProgress || isFlowDisabled}
          onClick={handleRetry}>
          Retry{isRetryInProgress ? <Spinner size={16} className={classes.spinnerIcon} /> : null}
        </Button>
      </ButtonGroup>
    </div>

  );
}
