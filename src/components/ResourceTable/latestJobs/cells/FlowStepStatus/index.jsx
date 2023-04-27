import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { JOB_STATUS, JOB_TYPES } from '../../../../../constants';
import JobStatus from '../../../../JobDashboard/JobStatus';
import { JOB_UI_STATUS, RETRY_JOB_UI_STATUS } from '../../../../../utils/jobdashboard';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  spinnerWrapper: {
    marginRight: theme.spacing(1),
  },
}));

export default function FlowStepStatus({ job }) {
  const classes = useStyles();

  // A specific case to show In progress parent job when there are no children created yet
  if (job.status === JOB_STATUS.RUNNING && (job._expOrImpId || job._exportId) && !job._flowJobId && !job._parentJobId) {
    return (
      <div className={classes.flexContainer}>
        <div className={classes.spinnerWrapper}>
          <Spinner size="small" />
        </div>
        {job.type === JOB_TYPES.RETRY ? RETRY_JOB_UI_STATUS[job.status] : JOB_UI_STATUS[job.status]}
      </div>
    );
  }

  // all other cases are already being handled by JobStatus component
  return (<JobStatus job={job} />);
}
