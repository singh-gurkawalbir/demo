import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import {
  selectedRetryIds,
  selectedErrorIds,
  errorActionsContext,
} from '../../../reducers';
import Spinner from '../../Spinner';
import ActionStatus from './ActionStatus';

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
  const { flowId, resourceId, isResolved } = props;
  const isRetryInProgress = useSelector(
    state =>
      errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
        .status === 'requested'
  );
  const isResolveInProgress = useSelector(
    state =>
      !isResolved &&
      errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
        .status === 'requested'
  );
  const isActionInProgress = useMemo(
    () => isRetryInProgress || isResolveInProgress,
    [isResolveInProgress, isRetryInProgress]
  );
  const areSelectedErrorsRetriable = useSelector(
    state =>
      !!selectedRetryIds(state, {
        flowId,
        resourceId,
        options: { isResolved },
      }).length
  );
  const isAtleastOneErrorSelected = useSelector(
    state =>
      !!selectedErrorIds(state, {
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
  const resolveErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.resolve({
        flowId,
        resourceId,
      })
    );
  }, [dispatch, flowId, resourceId]);

  return (
    <div className={classes.actionButtonsContainer}>
      <ActionStatus flowId={flowId} resourceId={resourceId} />
      {!isResolved ? (
        <Button
          variant="outlined"
          disabled={!isAtleastOneErrorSelected || isActionInProgress}
          onClick={resolveErrors}>
          Resolve &nbsp;{isResolveInProgress ? <Spinner size={16} /> : null}
        </Button>
      ) : null}

      <Button
        variant="outlined"
        disabled={!areSelectedErrorsRetriable || isActionInProgress}
        onClick={retryErrors}>
        Retry &nbsp;{isRetryInProgress ? <Spinner size={16} /> : null}
      </Button>
    </div>
  );
}
