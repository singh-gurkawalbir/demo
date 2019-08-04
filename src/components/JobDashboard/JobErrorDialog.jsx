import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography, IconButton, withStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { JOB_TYPES } from '../../utils/constants';
/* import actionTypes from '../../actions/types';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus'; */
import JobErrorTable from './JobErrorTable';

const styles = theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing.unit,
    top: theme.spacing.unit,
    color: theme.palette.grey[500],
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

  useEffect(() => {
    if (childJobId) {
      dispatch(
        actions.job.requestErrors({
          jobId: childJobId,
        })
      );
    } else if (flowJob.children.length > 0) {
      const jobsWithErrors = flowJob.children.filter(
        j => j.type === JOB_TYPES.IMPORT && j.numError > 0
      );

      if (jobsWithErrors.length > 0) {
        setChildJobId(jobsWithErrors[0]._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childJobId, flowJob.children.length]);

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
    <Fragment>
      {job && (
        <Dialog open maxWidth={false}>
          <DialogTitle>
            <Typography>
              {`${integrationName} > ${flowJob && flowJob.name}`}
            </Typography>
            <IconButton
              className={classes.closeButton}
              onClick={handleCloseClick}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ width: '70vw' }}>
            <Typography>
              Success: {job.numSuccess} Ignore: {job.numIgnore} Error:{' '}
              {job.numError} Duration: {job.duration} Completed:{' '}
              {job.endedAtAsString}
            </Typography>
            <JobErrorTable jobErrors={jobErrors} />
          </DialogContent>
        </Dialog>
      )}
    </Fragment>
  );
}

export default withStyles(styles)(JobErrorDialog);
