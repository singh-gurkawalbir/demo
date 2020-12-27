import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import ErrorTable from './ErrorTable';
import DownloadErrorsDrawer from './DownloadErrorsDrawer';
import ErrorDetailsDrawer from './ErrorTable/ErrorDetailsDrawer';
import { selectors } from '../../reducers';

export default function ErrorList({ flowId, errorType }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceId } = match.params;
  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?._integrationId || 'none'
  );
  const users = useSelector(state =>
    selectors.availableUsersList(state, integrationId)
  );

  useEffect(() => {
    dispatch(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId}));

    return () => {
      dispatch(actions.errorManager.retryStatus.clear(flowId));
      dispatch(actions.errorManager.flowErrorDetails.clear({ flowId, resourceId }));
      dispatch(actions.clearFilter('openErrors'));
      dispatch(actions.clearFilter('resolvedErrors'));
    };
  }, [dispatch, flowId, resourceId]);

  const requestIntegrationUsers = useCallback(() => {
    if (!users) {
      dispatch(actions.resource.requestCollection(`integrations/${integrationId}/ashares`));
    }
  }, [dispatch, integrationId, users]);

  useEffect(() => {
    requestIntegrationUsers();
  }, [requestIntegrationUsers]);

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
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} isResolved={errorType === 'resolved'} />
    </>
  );
}
