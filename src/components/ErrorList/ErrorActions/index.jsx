import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import Spinner from '../../Spinner';
import ErrorActionStatus from '../ErrorActionStatus';
import useConfirmDialog from '../../ConfirmDialog';

const useStyles = makeStyles(theme => ({
  actionButtonsContainer: {
    position: 'relative',
    top: '30px',
    left: 600,
    width: 430,
    '& > button': {
      marginLeft: '10px',
      width: 120,
      float: 'right',
    },
    '& > div': {
      width: 150,
    },
  },
  icon: {
    position: 'relative',
    top: theme.spacing(1),
  },
}));

export default function ErrorActions(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { confirmDialog } = useConfirmDialog();
  const { flowId, resourceId, isResolved } = props;
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
    <div className={classes.actionButtonsContainer}>
      <ErrorActionStatus flowId={flowId} resourceId={resourceId} />
      {!isResolved ? (
        <Button
          variant="outlined"
          disabled={!isAtleastOneErrorSelected || isActionInProgress}
          onClick={handleResolve}>
          Resolve &nbsp;{isResolveInProgress ? <Spinner size={16} /> : null}
        </Button>
      ) : null}

      <Button
        variant="outlined"
        disabled={!areSelectedErrorsRetriable || isActionInProgress}
        onClick={handleRetry}>
        Retry &nbsp;{isRetryInProgress ? <Spinner size={16} /> : null}
      </Button>
    </div>
  );
}
