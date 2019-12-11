import { Fragment, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { useDispatch, useSelector } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingSnackbar from '../../PingSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers/index';
import DynaAction from '../../DynaForm/DynaAction';
import { PING_STATES } from '../../../reducers/comms/ping';

const styles = theme => ({
  actions: {
    textAlign: 'right',
  },
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

export const PingMessage = props => {
  const { resourceId } = props;
  const dispatch = useDispatch();
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const handleCancelTest = useCallback(
    () => dispatch(actions.resource.connections.testCancelled(resourceId)),
    [dispatch, resourceId]
  );
  const handleTestClear = useCallback(
    () => dispatch(actions.resource.connections.testClear(resourceId)),
    [dispatch, resourceId]
  );

  return (
    <PingSnackbar
      commStatus={testConnectionCommState}
      onHandleClose={handleTestClear}
      onHandleCancelTask={handleCancelTest}
    />
  );
};

const TestButton = props => {
  const { classes, resourceId, label } = props;
  const dispatch = useDispatch();
  const handleTestConnection = useCallback(
    values => dispatch(actions.resource.connections.test(resourceId, values)),
    [dispatch, resourceId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  return (
    <Fragment>
      <PingMessage resourceId={resourceId} />
      <DynaAction
        {...props}
        disabled={pingLoading}
        onClick={handleTestConnection}
        className={classes.actionButton}
        size="small"
        variant="contained"
        color="secondary">
        {label || 'Test'}
      </DynaAction>
    </Fragment>
  );
};

export default withStyles(styles)(TestButton);
