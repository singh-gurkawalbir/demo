import { useCallback } from 'react';
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

const useStyles = makeStyles(() => ({
  actionButtonsContainer: {
    position: 'relative',
    top: '30px',
    left: 600,
    width: 400,
    '& > button': {
      marginLeft: '10px',
      width: 120,
    },
    '& > div': {
      width: 150,
    },
  },
}));

export default function ErrorActions(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { flowId, resourceId } = props;
  const { status: retryStatus, count } = useSelector(state =>
    errorActionsContext(state, { flowId, resourceId, actionType: 'retry' })
  );
  const resolveStatus = useSelector(
    state =>
      errorActionsContext(state, { flowId, resourceId, actionType: 'resolve' })
        .status
  );
  const areSelectedErrorsRetriable = useSelector(
    state =>
      !!selectedRetryIds(state, {
        flowId,
        resourceId,
      }).length
  );
  const isAtleastOneErrorSelected = useSelector(
    state =>
      !!selectedErrorIds(state, {
        flowId,
        resourceId,
      }).length
  );
  const retryErrors = useCallback(() => {
    dispatch(
      actions.errorManager.flowErrorDetails.retry({
        flowId,
        resourceId,
      })
    );
  }, [dispatch, flowId, resourceId]);
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
      {count ? <span> Retrying {count} errors </span> : null}
      <Button
        variant="outlined"
        disabled={!areSelectedErrorsRetriable || retryStatus === 'requested'}
        onClick={retryErrors}>
        Retry &nbsp;{retryStatus === 'requested' ? <Spinner size={20} /> : null}
      </Button>
      <Button
        variant="outlined"
        disabled={!isAtleastOneErrorSelected || resolveStatus === 'requested'}
        onClick={resolveErrors}>
        Resolve &nbsp;
        {resolveStatus === 'requested' ? <Spinner size={20} /> : null}
      </Button>
    </div>
  );
}
