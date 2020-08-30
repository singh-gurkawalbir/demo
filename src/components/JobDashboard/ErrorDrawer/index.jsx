import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import JobErrorTable from '../JobErrorTable';
import Spinner from '../../Spinner';
import RetryDrawer from '../RetryDrawer';
import SpinnerWrapper from '../../SpinnerWrapper';

export default function ErrorDrawer({
  height = 'tall',
  jobId,
  includeAll = false,
  parentJobId,
  showResolved,
  numError = 0,
  numResolved = 0,
  onClose,
  integrationName,
}) {
  const dispatch = useDispatch();
  const [childJobId, setChildJobId] = useState(parentJobId ? jobId : undefined);
  const [errorCount, setErrorCount] = useState(
    childJobId ? numError + numResolved : undefined
  );
  const flowJob = useSelector(state =>
    selectors.flowJob(state, { jobId: parentJobId || jobId, includeAll })
  );
  const jobErrors = useSelector(state =>
    selectors.jobErrors(state, childJobId)
  );
  const flowJobChildrenLoaded = !!(flowJob?.children?.length > 0);
  const jobWithErrors = flowJob?.children?.find(j =>
    showResolved ? j.numResolved > 0 : j.numError > 0
  );
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(
    () => () => {
      dispatch(actions.job.error.clear());
    },
    [dispatch]
  );
  useEffect(() => {
    if (childJobId) {
      if (errorCount < 1000) {
        dispatch(
          actions.job.requestErrors({
            jobId: childJobId,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, childJobId]);
  useEffect(() => {
    if (!childJobId && flowJobChildrenLoaded) {
      if (jobWithErrors) {
        setChildJobId(jobWithErrors._id);
        setErrorCount(jobWithErrors.numError + jobWithErrors.numResolved);
      }
    }
  }, [dispatch, childJobId, flowJobChildrenLoaded, jobWithErrors, showResolved]);
  let job;

  if (childJobId) {
    job = flowJob?.children?.find(j => j._id === childJobId);
  }
  const updatedIntegrationName = integrationName === null ? 'Standalone Flows' : `${integrationName}`;
  let title = ` ${updatedIntegrationName} > ${flowJob?.name}`;

  if (job?.name) title += ` > ${job.name}`;

  return (
    <RightDrawer
      path="viewErrors"
      height={height}
      width="full"
      // type="paper"
      title={title}
      variant="temporary"
      helpKey="jobErrors.helpSummary"
      helpTitle="Job errors"
      onClose={handleClose}>
      {!job ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        <>
          <RetryDrawer jobId={job._id} flowJobId={job._flowJobId} height={height} />
          <JobErrorTable
            jobErrors={jobErrors}
            errorCount={errorCount}
            job={job}
            onCloseClick={onClose}
          />
        </>
      )}
    </RightDrawer>
  );
}
