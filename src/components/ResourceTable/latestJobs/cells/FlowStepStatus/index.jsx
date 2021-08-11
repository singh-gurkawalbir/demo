import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { JOB_STATUS } from '../../../../../utils/constants';
import Spinner from '../../../../Spinner';
import JobStatus from '../../../../JobDashboard/JobStatus';
import { JOB_UI_STATUS } from '../../../../../utils/jobdashboard';

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
  if (job.status === JOB_STATUS.RUNNING && job._exportId && !job._flowJobId) {
    return (
      <div className={classes.flexContainer}>
        <div className={classes.spinnerWrapper}>
          <Spinner size={18} />
        </div>
        {JOB_UI_STATUS[job.status]}
      </div>
    );
  }

  // all other cases are already being handled by JobStatus component
  return (<JobStatus job={job} />);
}
