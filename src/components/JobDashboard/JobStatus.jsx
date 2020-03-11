import { makeStyles } from '@material-ui/core/styles';
import { JOB_STATUS, JOB_TYPES } from '../../utils/constants';
import { JOB_UI_STATUS } from './util';
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
      // return JOB_UI_STATUS[job.uiStatus];
      let errorPercentage = 0;
      let resolvedPercentage = 0;
      const total =
        (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

      if (
        [JOB_STATUS.CANCELED, JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].indexOf(
          job.status
        ) > -1
        // &&
        // (job.numSuccess > 0 || job.numError > 0 || job.numResolved > 0)
      ) {
        if (job.numError > 0) {
          if (job.numError < job.numResolved) {
            errorPercentage = Math.floor((job.numError * 100) / total);
          } else {
            errorPercentage = Math.ceil((job.numError * 100) / total);
          }
        }

        if (job.numResolved > 0) {
          if (job.numResolved < job.numError) {
            resolvedPercentage = Math.floor((job.numResolved * 100) / total);
          } else {
            resolvedPercentage = Math.ceil((job.numResolved * 100) / total);
          }
        }

        return (
          <StatusTag
            variant="success"
            label={JOB_UI_STATUS[job.uiStatus]}
            errorValue={errorPercentage}
            resolvedValue={resolvedPercentage}
          />
        );
      }
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }

  if (job.type === JOB_TYPES.EXPORT) {
    if (job.uiStatus !== JOB_STATUS.RUNNING) {
      let errorPercentage = 0;
      let resolvedPercentage = 0;
      const total =
        (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

      if (
        [JOB_STATUS.CANCELED, JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].includes(
          job.status
        )
        // &&
        // (job.numSuccess > 0 || job.numError > 0 || job.numResolved > 0)
      ) {
        if (job.numError > 0) {
          if (job.numError < job.numResolved) {
            errorPercentage = Math.floor((job.numError * 100) / total);
          } else {
            errorPercentage = Math.ceil((job.numError * 100) / total);
          }
        }

        if (job.numResolved > 0) {
          if (job.numResolved < job.numError) {
            resolvedPercentage = Math.floor((job.numResolved * 100) / total);
          } else {
            resolvedPercentage = Math.ceil((job.numResolved * 100) / total);
          }
        }

        return (
          <StatusTag
            variant="success"
            label={JOB_UI_STATUS[job.uiStatus]}
            errorValue={errorPercentage}
            resolvedValue={resolvedPercentage}
          />
        );
      }
    }

    return JOB_UI_STATUS[job.uiStatus];
  }

  if (job.type === JOB_TYPES.IMPORT) {
    if (job.uiStatus !== JOB_STATUS.RUNNING || !job.percentComplete) {
      // return JOB_UI_STATUS[job.uiStatus];
      let errorPercentage = 0;
      let resolvedPercentage = 0;
      const total =
        (job.numSuccess || 0) + (job.numError || 0) + (job.numResolved || 0);

      if (
        [JOB_STATUS.CANCELED, JOB_STATUS.COMPLETED, JOB_STATUS.FAILED].indexOf(
          job.status
        ) > -1
        // &&
        // (job.numSuccess > 0 || job.numError > 0 || job.numResolved > 0)
      ) {
        if (job.numError > 0) {
          if (job.numError < job.numResolved) {
            errorPercentage = Math.floor((job.numError * 100) / total);
          } else {
            errorPercentage = Math.ceil((job.numError * 100) / total);
          }
        }

        if (job.numResolved > 0) {
          if (job.numResolved < job.numError) {
            resolvedPercentage = Math.floor((job.numResolved * 100) / total);
          } else {
            resolvedPercentage = Math.ceil((job.numResolved * 100) / total);
          }
        }

        return (
          <StatusTag
            variant="success"
            label={JOB_UI_STATUS[job.uiStatus]}
            errorValue={errorPercentage}
            resolvedValue={resolvedPercentage}
          />
        );
      }
    }

    if (job.percentComplete === 100) {
      return JOB_UI_STATUS.COMPLETING;
    }

    return `${JOB_UI_STATUS[job.uiStatus]} ${job.percentComplete} %`;
  }
}
