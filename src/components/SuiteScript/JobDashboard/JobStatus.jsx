import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StatusTag from '../../../components/StatusTag';
import Spinner from '../../Spinner';
import { getJobStatusDetails } from './util';

const useStyles = makeStyles(theme => ({
  state: {
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  spinnerWrapper: {
    marginRight: 10,
  },
  link: {
    fontFamily: 'Roboto400',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
}));

export default function JobStatus({ job }) {
  const classes = useStyles();
  const jobStatusDetails = getJobStatusDetails(job);

  if (job._id === '3087511') {
    console.log(`jobStatusDetails`, jobStatusDetails);
  }

  if (jobStatusDetails.showStatusTag) {
    return (
      <StatusTag
        variant={jobStatusDetails.variant}
        label={jobStatusDetails.status}
        errorValue={jobStatusDetails.errorValue || 0}
      />
    );
  }

  if (jobStatusDetails.showSpinner) {
    return (
      <Fragment>
        <div className={classes.state}>
          <div className={classes.spinnerWrapper}>
            <Spinner size={24} color="primary" />
          </div>
          {jobStatusDetails.status}
        </div>
      </Fragment>
    );
  }

  return jobStatusDetails.status;
}
