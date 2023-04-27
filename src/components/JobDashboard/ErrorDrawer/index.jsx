import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import JobErrorTable from '../JobErrorTable';
import RetryDrawer from '../RetryDrawer';
import { JOB_STATUS } from '../../../constants';
import { drawerPaths } from '../../../utils/rightDrawer';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles({
  wrapperErrorDrawer: {
    position: 'relative',
    height: '100%',
  },
});

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
  const classes = useStyles();
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
  let jobWithErrors;
  let anyChildJobsAreInProgress = false;

  if (flowJobChildrenLoaded) {
    jobWithErrors = flowJob.children.find(j =>
      (showResolved ? j.numResolved > 0 : j.numError > 0) && j.errorFile
    );
    if (!jobWithErrors) {
      anyChildJobsAreInProgress = flowJob.children.filter(j =>
        [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(j.status)
      ).length > 0;
    }
  }

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

  useEffect(() => {
    if (anyChildJobsAreInProgress) {
      dispatch(actions.job.requestInProgressJobStatus());
    }
  }, [anyChildJobsAreInProgress, dispatch]);
  let job;

  if (childJobId) {
    job = flowJob?.children?.find(j => j._id === childJobId);
  }
  const updatedIntegrationName = integrationName === null ? 'Standalone flows' : `${integrationName}`;
  let title = ` ${updatedIntegrationName} > ${flowJob?.name}`;

  if (job?.name) title += ` > ${job.name}`;

  return (
    <RightDrawer
      path={drawerPaths.ERROR_MANAGEMENT.V1.VIEW_JOB_ERRORS}
      height={height}
      width="full"
      helpKey="jobErrors.helpSummary"
      helpTitle="Job errors"
      onClose={handleClose}>
      <DrawerHeader title={title} />
      <DrawerContent>
        <div className={classes.wrapperErrorDrawer}>
          {(!flowJobChildrenLoaded || anyChildJobsAreInProgress) && (
          <Spinner center="screen" >
            <span>{anyChildJobsAreInProgress ? message.JOBS.CHILD_JOBS_IN_PROGRESS : message.JOBS.LOAD_CHILD_JOBS}</span>
          </Spinner>
          )}
          {(flowJobChildrenLoaded && !anyChildJobsAreInProgress && !jobWithErrors) && (
            <span>No jobs with errors</span>
          )}
          {job && (
            <>
              <RetryDrawer jobId={job._id} flowJobId={job._parentJobId || job._flowJobId} height={height} />
              <JobErrorTable
                jobErrors={jobErrors}
                errorCount={errorCount}
                job={job}
                onCloseClick={onClose}
          />
            </>
          )}
        </div>
      </DrawerContent>
    </RightDrawer>
  );
}
