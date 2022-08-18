import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Grow, makeStyles } from '@material-ui/core';
import actions from '../../actions';
import ErrorTable from './ErrorTable';
import DownloadErrorsDrawer from './DownloadErrorsDrawer';
import ErrorDetailsDrawer from './ErrorTable/ErrorDetailsDrawer';
import ErrorDetailsPanel from './ErrorTable/ErrorDetailsPanel';
import { FILTER_KEYS } from '../../utils/errorManagement';
import { selectors } from '../../reducers';

const useStyles = makeStyles(theme => ({
  errorList: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  errorTable: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    // flexShrink: 0,
    // flexBasis: 50,
  },
  errorDetailsPanel: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    // flexShrink: 0,
    // flexBasis: 50,
  },
}));

export default function ErrorList({ flowId }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { resourceId, errorType, flowJobId } = match.params;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, errorType]);

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
    <div className={classes.errorList}>
      <ErrorTable
        flowId={flowId}
        flowJobId={flowJobId}
        resourceId={resourceId}
        isResolved={errorType === 'resolved'}
        className={classes.errorTable}
      />
      <DownloadErrorsDrawer flowId={flowId} resourceId={resourceId} />
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} isResolved={errorType === 'resolved'} />

      {/* <ErrorDetailsPanel
        flowId={flowId}
        resourceId={resourceId}
        isResolved={errorType === 'resolved'}
        className={classes.errorDetailsPanel}
      /> */}
    </div>
  );
}
