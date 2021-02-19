import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PingMessageSnackbar from '../../PingMessageSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers/index';
import DynaAction from '../../DynaForm/DynaAction';
import { PING_STATES } from '../../../reducers/comms/ping';

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
  const handleTestMessageClear = useCallback(
    () =>
      // passing true retains status. Message is cleared off
      dispatch(actions.resource.connections.testClear(resourceId, true)),
    [dispatch, resourceId]
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
  const { resourceId } = props;
  const [isTesting, setIsTesting] = useState(false);
  const dispatch = useDispatch();
  const handleTestConnection = useCallback(
    values => {
      const newValues = { ...values };

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }
      setIsTesting(true);
      dispatch(actions.resource.connections.test(resourceId, newValues));
    },
    [dispatch, resourceId]
  );
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  useEffect(() => {
    if (isTesting && !pingLoading) {
      setIsTesting(false);
    }
  }, [testConnectionCommState, isTesting, pingLoading]);

  return (
    <>
      <PingMessage resourceId={resourceId} />
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
