import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import Spinner from '../Spinner';
import StatusTag from '../../components/StatusTag';
import { getJobStatusDetails } from './util';
import HelpIcon from '../icons/HelpIcon';

const useStyles = makeStyles({
  state: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  spinnerWrapper: {
    marginRight: 10,
  },
});

export default function JobStatus({ job }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const jobStatusDetails = getJobStatusDetails(job);
  const handleQueuedJobsClick = useCallback(() => {
    history.push(`${match.url}/flows/${job._flowId}/queuedJobs`);
  }, [history, job._flowId, match.url]);

  if (jobStatusDetails.showStatusTag) {
    return (
      <StatusTag
        variant={jobStatusDetails.variant}
        label={jobStatusDetails.status}
        errorValue={jobStatusDetails.errorValue}
        resolvedValue={jobStatusDetails.resolvedValue}
      />
    );
  }

  if (jobStatusDetails.showSpinner) {
    return (
      <div className={classes.state}>
        <div className={classes.spinnerWrapper}>
          <Spinner size={24} color="primary" />
        </div>
        {jobStatusDetails.status}
        <IconButton color="secondary" onClick={handleQueuedJobsClick}>
          <HelpIcon />
        </IconButton>
      </div>
    );
  }

  return jobStatusDetails.status;
}
