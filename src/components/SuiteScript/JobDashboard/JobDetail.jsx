import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import { useState, Fragment } from 'react';
import { JOB_STATUS } from '../../../utils/constants';
import JobStatus from './JobStatus';
import { getSuccess } from './util';
// import JobActionsMenu from './JobActionsMenu';
import DateTimeDisplay from '../../DateTimeDisplay';

const useStyles = makeStyles(theme => ({
  icon: {
    margin: theme.spacing.double,
  },
  spinner: {
    left: '0px',
    right: '0px',
    background: 'rgba(106, 123, 137, 0.7)',
    width: '100%',
    position: 'absolute',
    color: theme.palette.background.paper,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    zIndex: 1,
    padding: 14,
    '& span': {
      marginLeft: '10px',
      color: theme.palette.background.paper,
    },
  },
  checkAction: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    '& li': {
      float: 'left',
      '&:empty': {
        marginLeft: 22,
      },
    },
  },
  moreIcon: {
    padding: 0,
  },
  checkIcon: {
    padding: 0,
  },
  name: {
    width: '18.15%',
  },
  status: {
    width: '10.15%',
  },
  success: {
    width: '9%',
    textAlign: 'right',
  },
  ignore: {
    width: '7.5%',
    textAlign: 'right',
  },
  error: {
    width: '10.15%',
    textAlign: 'right',
  },
  errorCount: {
    color: theme.palette.error.main,
  },
  resolved: {
    width: '9%',
    textAlign: 'right',
  },
  pages: {
    width: '7.5%',
    textAlign: 'right',
  },
  duration: {
    width: '9%',
    textAlign: 'right',
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'nowrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
  stateBtn: {
    color: theme.palette.error.main,
    float: 'right',
    padding: 0,
    minWidth: 'unset',
    '&:hover': {
      color: `${theme.palette.error.dark} !important`,
    },
  },
  checkActionBorder: {
    paddingLeft: '13px',
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
}));

export default function JobDetail({
  job,
  selectedJobs,
  onSelectChange,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
  isFlowBuilderView,
}) {
  const classes = useStyles();
  const [showViewErrorsLink, setShowViewErrorsLink] = useState(false);
  const isSelected = !!(
    selectedJobs[job._id] && selectedJobs[job._id].selected
  );
  const isJobInProgress = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
    job.status
  );

  function handleSelectChange(event) {
    const { checked } = event.target;
    const jobIds = { ...selectedJobs };
    const currJob = jobIds[job._id] || {};

    currJob.selected = checked;

    onSelectChange(currJob, job._id);
  }

  function handleViewErrorsClick() {
    onViewErrorsClick({
      jobId: job._id,
      jobType: job.type,
      numError: job.numError,
    });
  }

  return (
    <Fragment>
      <TableRow>
        <TableCell
          className={clsx(
            {
              [classes.checkActionBorder]: isSelected,
            },
            classes.checkFlow
          )}>
          <ul className={classes.checkAction}>
            <li>
              <Checkbox
                disabled={!job.numError}
                checked={isSelected}
                className={classes.checkIcon}
                color="primary"
                onChange={event => handleSelectChange(event)}
              />
            </li>
          </ul>
        </TableCell>
        <TableCell className={classes.name} data-test={job.name || job._flowId}>
          {job.name || job._flowId}
        </TableCell>
        <TableCell className={classes.status}>
          <JobStatus job={job} />
        </TableCell>
        <TableCell className={classes.success}>{getSuccess(job)}</TableCell>
        <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>
        <TableCell
          onMouseEnter={() => {
            setShowViewErrorsLink(true);
          }}
          onMouseLeave={() => {
            setShowViewErrorsLink(false);
          }}
          className={clsx(classes.error, {
            [classes.errorCount]: job.numError > 0,
          })}>
          {showViewErrorsLink && !isJobInProgress && job.numError > 0 ? (
            <Button
              data-test="viewJobErrors"
              variant="text"
              color="primary"
              className={classes.stateBtn}
              onClick={() => {
                handleViewErrorsClick(false);
              }}>
              {job.numError} View
            </Button>
          ) : (
            job.numError
          )}
        </TableCell>
        <TableCell className={classes.duration}>{job.duration}</TableCell>
        <TableCell className={classes.completed}>
          <DateTimeDisplay dateTime={job.endedAt} />
        </TableCell>
        <TableCell className={classes.actions}>
          {/* <JobActionsMenu
            job={job}
            userPermissionsOnIntegration={userPermissionsOnIntegration}
            integrationName={integrationName}
            isFlowBuilderView={isFlowBuilderView}
          /> */}
        </TableCell>
      </TableRow>
    </Fragment>
  );
}
