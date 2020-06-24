import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import RightDrawer from '../../drawer/Right';
import JobErrorTable from '../JobErrorTable';
import Spinner from '../../Spinner';


const useStyles = makeStyles(() => ({
  spinner: {
    left: 0,
    right: 0,
    top: -40,
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    '& span': {
      marginLeft: '10px',
    },
  },
}));

export default function ErrorDrawer({
  height = 'short',
  jobId,
  parentJobId,
  showResolved,
  numError = 0,
  numResolved = 0,
  onClose,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [childJobId, setChildJobId] = useState(parentJobId ? jobId : undefined);
  const [errorCount, setErrorCount] = useState(
    childJobId ? numError + numResolved : undefined
  );
  const flowJob = useSelector(state =>
    selectors.flowJob(state, { jobId: parentJobId || jobId })
  );
  const jobErrors = useSelector(state =>
    selectors.jobErrors(state, childJobId)
  );

  const flowJobChildrenLoaded = !!(flowJob?.children?.length > 0);
  const jobWithErrors = flowJob?.children?.find(j =>
    showResolved ? j.numResolved > 0 : j.numError > 0
  );
  const handleClose = useCallback(() => {
    setChildJobId();
    setErrorCount();
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
        setErrorCount(jobWithErrors.numError + jobWithErrors.numResolved);
        setChildJobId(jobWithErrors._id);
      }
    }
    // eeslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, childJobId, flowJobChildrenLoaded, jobWithErrors, showResolved]);

  let job;

  if (childJobId) {
    job = flowJob?.children?.find(j => j._id === childJobId);
  }

  let title = flowJob?.name;
  if (job?.name) title += ` > ${job.name}`;

  return (
    <RightDrawer
      path="viewErrors"
      height={height}
      width="xl"
      // type="paper"
      title={title}
      variant="temporary"
      // actions={!isInviteUser && action}
      helpKey="jobErrors.helpSummary"
      helpTitle="Job errors"
      onClose={handleClose}>

      {!job ? (
        <div className={classes.spinner}>
          <Spinner size={20} /> <span>Loading child jobs...</span>
        </div>
      ) : (
        <JobErrorTable
          jobErrors={jobErrors}
          errorCount={errorCount}
          job={job}
          onCloseClick={onClose}
          />
      )}
    </RightDrawer>
  );
}
