import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import ClipboardCopy from '../ClipboardCopy';


export default function AgentToken({ agentId }) {
  const dispatch = useDispatch();
  const { accessToken } = useSelector(state =>
    selectors.agentAccessToken(state, agentId)
  );
  const displayAgentToken = useCallback(() => {
    dispatch(actions.agent.displayToken(agentId));
  }, [agentId, dispatch]);

  return (
    <ClipboardCopy onShowToken={displayAgentToken} token={accessToken} testAttr="displayAgentToken" />
  );
}
