import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import { selectedRetryIds, selectedErrorIds } from '../../../reducers';

const useStyles = makeStyles(() => ({
  actionButtonsContainer: {
    position: 'relative',
    top: '30px',
    left: `calc(100% - ${500}px)`,
    '& > button': {
      marginLeft: '10px',
    },
  },
}));

export default function ErrorActions(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { flowId, resourceId } = props;
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
      <Button
        variant="outlined"
        disabled={!areSelectedErrorsRetriable}
        onClick={retryErrors}>
        Retry
      </Button>
      <Button
        variant="outlined"
        disabled={!isAtleastOneErrorSelected}
        onClick={resolveErrors}>
        Resolve
      </Button>
    </div>
  );
}
