import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, IconButton, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import actions from '../../actions';
import * as selectors from '../../reducers';
import JobErrorTable from './JobErrorTable';
import Spinner from '../Spinner';

const styles = theme => ({
  title: {
    minWidth: '640px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  spinner: {
    left: '0px',
    right: '0px',
    background: 'rgba(0,0,0,0.7)',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    '& div': {
      width: '20px !important',
      height: '20px !important',
    },
    '& span': {
      marginLeft: '10px',
      color: '#fff',
    },
  },
});

function JobErrorDialog({
  classes,
  // jobType,
  jobId,
  parentJobId,
  onCloseClick,
  integrationName,
}) {
  const dispatch = useDispatch();
  const [childJobId, setChildJobId] = useState(parentJobId ? jobId : undefined);
  const flowJob = useSelector(state =>
    selectors.flowJob(state, { jobId: parentJobId || jobId })
  );
  const [flowJobChildrenLoaded, setFlowJobChildrenLoaded] = useState(
    !!(flowJob && flowJob.children && flowJob.children.length > 0)
  );

  useEffect(
    () => () => {
      dispatch(actions.job.error.clear());
    },
    [dispatch]
  );

  useEffect(() => {
    if (flowJob && flowJob.children && flowJob.children.length > 0) {
      setFlowJobChildrenLoaded(true);
    }
  }, [flowJob]);

  useEffect(() => {
    if (childJobId) {
      dispatch(
        actions.job.requestErrors({
          jobId: childJobId,
        })
      );
    } else if (flowJobChildrenLoaded) {
      const jobsWithErrors = flowJob.children.filter(j => j.numError > 0);

      if (jobsWithErrors.length > 0) {
        setChildJobId(jobsWithErrors[0]._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, childJobId, flowJobChildrenLoaded]);

  let job;

  if (childJobId) {
    job = flowJob.children.find(j => j._id === childJobId);
  }

  const jobErrors = useSelector(state =>
    selectors.jobErrors(state, childJobId)
  );

  function handleCloseClick() {
    onCloseClick();
  }

  return (
    <Dialog open maxWidth={false}>
      <DialogTitle className={classes.title}>
        <Typography>
          {`${integrationName} > ${flowJob && flowJob.name}`}
        </Typography>
        <IconButton className={classes.closeButton} onClick={handleCloseClick}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {!job ? (
          <div className={classes.spinner}>
            <Spinner /> <span>Loading child jobs...</span>
          </div>
        ) : (
          <JobErrorTable
            jobErrors={jobErrors}
            job={job}
            onCloseClick={onCloseClick}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default withStyles(styles)(JobErrorDialog);
