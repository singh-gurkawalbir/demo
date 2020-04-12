import { Fragment, useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import DoneIcon from '@material-ui/icons/Done';
import { useDispatch, useSelector } from 'react-redux';
// import Chip from '@material-ui/core/Chip';
// import CircularProgress from '@material-ui/core/CircularProgress';
import PingMessageSnackbar from '../../../PingMessageSnackbar';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers/index';
import DynaAction from '../../../DynaForm/DynaAction';
import { PING_STATES } from '../../../../reducers/comms/ping';

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
  const { resourceId, ssLinkedConnectionId } = props;
  const dispatch = useDispatch();
  const testConnectionCommState = useSelector(state =>
    selectors.suiteScriptTestConnectionCommState(
      state,
      resourceId,
      ssLinkedConnectionId
    )
  );
  const handleCancelTest = useCallback(
    () =>
      dispatch(
        actions.suiteScript.resource.connections.testCancelled(
          resourceId,
          undefined,
          ssLinkedConnectionId
        )
      ),
    [dispatch, resourceId, ssLinkedConnectionId]
  );
  const handleTestMessageClear = useCallback(
    () =>
      // passing true retains status. Message is cleared off
      dispatch(
        actions.suiteScript.resource.connections.testClear(
          resourceId,
          true,
          ssLinkedConnectionId
        )
      ),
    [dispatch, resourceId, ssLinkedConnectionId]
  );

  return (
    <PingMessageSnackbar
      commStatus={testConnectionCommState}
      onClose={handleTestMessageClear}
      onCancelTask={handleCancelTest}
    />
  );
};

const TestButton = props => {
  console.log(`SS TestButton props`, props);
  const { classes, resourceId, label, ssLinkedConnectionId } = props;
  const dispatch = useDispatch();
  const handleTestConnection = useCallback(
    values =>
      dispatch(
        actions.suiteScript.resource.connections.test(
          resourceId,
          values,
          ssLinkedConnectionId
        )
      ),
    [dispatch, resourceId, ssLinkedConnectionId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.suiteScriptTestConnectionCommState(
      state,
      resourceId,
      ssLinkedConnectionId
    )
  );

  console.log(`SS testConnectionCommState`, testConnectionCommState);

  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  return (
    <Fragment>
      <PingMessage
        ssLinkedConnectionId={ssLinkedConnectionId}
        resourceId={resourceId}
      />
      <DynaAction
        {...props}
        disabled={pingLoading}
        onClick={handleTestConnection}
        className={classes.actionButton}
        size="small"
        variant="outlined"
        color="secondary">
        {label || 'Test connection'}
      </DynaAction>
    </Fragment>
  );
};

export default withStyles(styles)(TestButton);
