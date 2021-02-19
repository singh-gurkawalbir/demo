import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PingMessageSnackbar from '../../../PingMessageSnackbar';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers/index';
import DynaAction from '../../../DynaForm/DynaAction';
import { PING_STATES } from '../../../../reducers/comms/ping';

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
  const { resourceId, ssLinkedConnectionId } = props;
  const [isTesting, setIsTesting] = useState(false);
  const dispatch = useDispatch();
  const handleTestConnection = useCallback(
    values => {
      setIsTesting(true);
      dispatch(
        actions.suiteScript.resource.connections.test(
          resourceId,
          values,
          ssLinkedConnectionId
        )
      );
    },
    [dispatch, resourceId, ssLinkedConnectionId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.suiteScriptTestConnectionCommState(
      state,
      resourceId,
      ssLinkedConnectionId
    )
  );

  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  useEffect(() => {
    if (isTesting && !pingLoading) {
      setIsTesting(false);
    }
  }, [testConnectionCommState, isTesting, pingLoading]);

  return (
    <>
      <PingMessage
        ssLinkedConnectionId={ssLinkedConnectionId}
        resourceId={resourceId}
      />
      <DynaAction
        {...props}
        disabled={pingLoading}
        onClick={handleTestConnection}
        size="small"
        variant="outlined"
        color="secondary">
        {isTesting ? 'Testing' : 'Test connection'}
      </DynaAction>
    </>
  );
};

export default TestButton;
