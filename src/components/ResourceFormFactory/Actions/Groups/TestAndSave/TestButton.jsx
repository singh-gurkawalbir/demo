import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import PingMessageSnackbar from '../../../../PingMessageSnackbar';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers/index';
import DynaAction from '../../../../DynaForm/DynaAction';
import { PING_STATES } from '../../../../../reducers/comms/ping';
import { getParentResourceContext } from '../../../../../utils/connections';

const emptyObj = {};

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
  const { resourceId, formKey, disabled } = props;
  const [isTesting, setIsTesting] = useState(false);
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const { flowId, integrationId } = useSelector(
    state => selectors.formParentContext(state, formKey) || emptyObj,
    shallowEqual
  );
  const { parentType, parentId } = getParentResourceContext(match.url);

  const handleTestConnection = useCallback(
    () => {
      const newValues = { ...values };

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }
      setIsTesting(true);
      dispatch(actions.resource.connections.test(resourceId, newValues, { flowId, integrationId, parentType, parentId }));
    },
    [dispatch, flowId, integrationId, parentType, parentId, resourceId, values]
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
        disabled={disabled || pingLoading}
        onClick={handleTestConnection}
        size="small"
        variant="outlined"
        color="secondary">
        {isTesting ? 'Testing' : 'Test connection'}
      </DynaAction>
    </>
  );
}
