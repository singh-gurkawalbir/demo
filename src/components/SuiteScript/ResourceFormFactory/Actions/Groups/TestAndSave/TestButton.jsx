import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import PingMessageSnackbar from '../../../../../PingMessageSnackbar';
import actions from '../../../../../../actions';
import { selectors } from '../../../../../../reducers/index';
import DynaAction from '../../../../../DynaForm/DynaAction';
import { PING_STATES } from '../../../../../../reducers/comms/ping';

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

export default function TestButton(props) {
  const { resourceId, ssLinkedConnectionId, formKey } = props;
  const [isTesting, setIsTesting] = useState(false);
  const dispatch = useDispatch();
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleTestConnection = useCallback(
    () => {
      setIsTesting(true);
      dispatch(
        actions.suiteScript.resource.connections.test(
          resourceId,
          values,
          ssLinkedConnectionId
        )
      );
    },
    [dispatch, resourceId, ssLinkedConnectionId, values]
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
}
