import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import ErrorTable from './ErrorTable';
import DownloadErrorsDrawer from './DownloadErrorsDrawer';
import ErrorDetailsDrawer from './ErrorTable/ErrorDetailsDrawer';
import { selectors } from '../../reducers';

export default function ErrorList({ flowId, errorsInRun }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { resourceId, errorType, flowJobId } = match.params;
  const isErrorFilterMetadataRequested = useSelector(state =>
    selectors.isErrorFilterMetadataRequested(state)
  );

  useEffect(() => {
    if (!isErrorFilterMetadataRequested) {
      dispatch(actions.errorManager.filterMetadata.request());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, errorType]);

  return (
    <>
      <ErrorTable
        errorsInRun={errorsInRun}
        flowId={flowId}
        flowJobId={flowJobId}
        resourceId={resourceId}
        isResolved={errorType === 'resolved'}
      />
      <DownloadErrorsDrawer flowId={flowId} resourceId={resourceId} />
      <ErrorDetailsDrawer flowId={flowId} resourceId={resourceId} isResolved={errorType === 'resolved'} />
    </>
  );
}
