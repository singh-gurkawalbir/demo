import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import OpenErrors from './OpenErrors';
import ResolvedErrors from './ResolvedErrors';
import actions from '../../actions';

export default function ErrorList({ flowId, errorType }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceId } = match.params;

  useEffect(() => {
    dispatch(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId}));

    return () => dispatch(actions.errorManager.retryStatus.cancelPoll());
  }, [dispatch, flowId, resourceId]);

  return (
    <>
      <OpenErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'open'}
      />
      <ResolvedErrors
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'resolved'}
      />
    </>
  );
}
