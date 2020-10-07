import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import ErrorTable from './ErrorTable';
import DownloadErrorsDrawer from './DownloadErrorsDrawer';

export default function ErrorList({ flowId, errorType }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceId } = match.params;

  useEffect(() => {
    dispatch(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId}));

    return () => dispatch(actions.errorManager.retryStatus.clear(flowId));
  }, [dispatch, flowId, resourceId]);

  return (
    <>
      <ErrorTable
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'open'}
      />
      <ErrorTable
        flowId={flowId}
        resourceId={resourceId}
        show={errorType === 'resolved'}
        isResolved
      />
      <DownloadErrorsDrawer flowId={flowId} resourceId={resourceId} />
    </>
  );
}
