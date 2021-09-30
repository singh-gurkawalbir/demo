import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import ErrorTable from './ErrorTable';
import DownloadErrorsDrawer from './DownloadErrorsDrawer';
import ErrorDetailsDrawer from './ErrorTable/ErrorDetailsDrawer';
import { FILTER_KEYS } from '../../utils/errorManagement';
import { selectors } from '../../reducers';

export default function ErrorList({ flowId }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceId, errorType } = match.params;

  const integrationId = useSelector(state =>
    selectors.resource(state, 'flows', flowId)?._integrationId || 'none'
  );
  const users = useSelector(state =>
    selectors.availableUsersList(state, integrationId)
  );
  const isErrorFilterMetadataRequested = useSelector(state =>
    selectors.isErrorFilterMetadataRequested(state)
  );

  useEffect(() => {
    if (!isErrorFilterMetadataRequested) {
      dispatch(actions.errorManager.filterMetadata.request());
    }
  }, [dispatch, isErrorFilterMetadataRequested]);

  useEffect(() => {
    dispatch(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId}));

    return () => {
      dispatch(actions.errorManager.retryStatus.stopPoll());
      dispatch(actions.errorManager.flowErrorDetails.clear({ flowId, resourceId }));
      dispatch(actions.clearFilter(FILTER_KEYS.OPEN));
      dispatch(actions.clearFilter(FILTER_KEYS.RESOLVED));
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
        isResolved={errorType === 'resolved'}
      />
      <DownloadErrorsDrawer flowId={flowId} resourceId={resourceId} />
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} isResolved={errorType === 'resolved'} />
    </>
  );
}
