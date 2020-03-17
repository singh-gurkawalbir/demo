import { makeStyles } from '@material-ui/core/styles';
import { getJobStatusDetails } from './util';
import Spinner from '../Spinner';
import StatusTag from '../../components/StatusTag';

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
  const jobStatusDetails = getJobStatusDetails(job);

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
      </div>
    );
  }

  return jobStatusDetails.status;
}
