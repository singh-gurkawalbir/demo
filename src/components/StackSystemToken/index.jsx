import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import ClipboardCopy from '../ClipboardCopy';


export default function StackSystemToken({ stackId }) {
  const dispatch = useDispatch();

  const { systemToken } = useSelector(state =>
    selectors.stackSystemToken(state, stackId)
  );
  const displaySystemToken = useCallback(() => {
    dispatch(actions.stack.displayToken(stackId));
  }, [dispatch, stackId]);


  return (
    <ClipboardCopy onShowToken={displaySystemToken} token={systemToken} showTokenTestAttr="copyStackSystemToken" />
  );
}
