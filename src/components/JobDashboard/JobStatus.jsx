import { makeStyles } from '@material-ui/core/styles';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';
import { JOB_UI_STATUS } from './util';
import Spinner from '../Spinner';

const useStyles = makeStyles({
  state: {
    display: 'flex',
    alignItems: 'center',
  },
  spinnerWrapper: {
    marginRight: 10,
  },
});

export default function JobStatus({ job }) {
  const classes = useStyles();

  if (job.type === JOB_TYPES.FLOW) {
    if (
      job.uiStatus === JOB_STATUS.QUEUED ||
      (job.uiStatus === JOB_STATUS.RUNNING && !job.doneExporting)
    ) {
      return (
        <div className={classes.state}>
          <div className={classes.spinnerWrapper}>
            <Spinner size={24} color="primary" />
          </div>
          {JOB_UI_STATUS[job.uiStatus]}
        </div>
      );
    }

    if (
      job.uiStatus !== JOB_STATUS.RUNNING ||
      !job.doneExporting ||
      !job.percentComplete
    ) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }

  if (job.type === JOB_TYPES.EXPORT) {
    return JOB_UI_STATUS[job.uiStatus];
  }

  if (job.type === JOB_TYPES.IMPORT) {
    if (job.uiStatus !== JOB_STATUS.RUNNING || !job.percentComplete) {
      return JOB_UI_STATUS[job.uiStatus];
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }
}
