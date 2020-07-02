import React from 'react';
import clsx from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { getPages, getSuccess } from './util';
import JobStatus from './JobStatus';
import JobActionsMenu from './JobActionsMenu';
import { JOB_STATUS } from '../../utils/constants';
import DateTimeDisplay from '../DateTimeDisplay';
import ErrorCountCell from './ErrorCountCell';

const useStyles = makeStyles(theme => ({
  checkAction: {
    paddingLeft: 58,
  },
  name: {
    width: '18.15%',
  },
  status: {
    width: '10.15',
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
  checkActionBorder: {
    paddingLeft: 55,
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
  errorCount: {
    color: theme.palette.error.main,
  },
}));

export default function ChildJobDetail({
  job,
  parentJob,
  onSelectChange,
  selectedJobs,
  userPermissionsOnIntegration,
  onViewErrorsClick,
  integrationName,
}) {
  const isJobInProgress = [
    JOB_STATUS.QUEUED,
    JOB_STATUS.RUNNING,
    JOB_STATUS.RETRYING,
  ].includes(job.uiStatus);
  const classes = useStyles();
  const isSelectable = !!(job.retriable || job.numError);
  const parentSelectionInfo = selectedJobs[parentJob._id] || {
    selected: false,
    selectedChildJobIds: [],
  };
  const isSelected =
    parentSelectionInfo.selected ||
    (parentSelectionInfo.selectedChildJobIds &&
      parentSelectionInfo.selectedChildJobIds.includes(job._id));

  if (
    isSelectable &&
    isSelected &&
    (!parentSelectionInfo.selectedChildJobIds ||
      !parentSelectionInfo.selectedChildJobIds.includes(job._id))
  ) {
    onSelectChange(true, job._id, true);
  }

  function handleSelectChange(event) {
    onSelectChange(event.target.checked, job._id);
  }

  function handleViewErrorsClick(showResolved = false) {
    onViewErrorsClick({
      jobId: job._id,
      parentJobId: parentJob._id,
      showResolved,
      numError: job.numError,
      numResolved: job.numResolved,
    });
  }

  const jobType = job.type === 'export' ? 'Export' : 'Import';

  return (
    <TableRow>
      <TableCell
        className={clsx(classes.checkAction, {
          [classes.checkActionBorder]: isSelected,
        })}>
        <Checkbox
          color="primary"
          disabled={!isSelectable}
          checked={isSelectable && isSelected}
          onChange={handleSelectChange}
        />
      </TableCell>
      <TableCell className={classes.name}>{job.name || jobType}</TableCell>
      <TableCell className={classes.status}>
        <JobStatus job={job} />
      </TableCell>
      <TableCell className={classes.success}>{getSuccess(job)}</TableCell>
      <TableCell className={classes.ignore}>{job.numIgnore}</TableCell>

      <ErrorCountCell
        count={job.numError}
        isJobInProgress={isJobInProgress}
        isError
        onClick={() => handleViewErrorsClick(false)}
        className={clsx(classes.error, {
          [classes.errorCount]: job.numError > 0,
        })}
      />
      <ErrorCountCell
        count={job.numResolved}
        isJobInProgress={isJobInProgress}
        onClick={() => handleViewErrorsClick(true)}
        className={classes.resolved}
      />
      <TableCell className={classes.pages}>
        {getPages(job, parentJob)}
      </TableCell>
      <TableCell className={classes.duration}>{job.duration}</TableCell>
      <TableCell className={classes.completed}>
        <DateTimeDisplay dateTime={job.endedAt} />
      </TableCell>
      <TableCell className={classes.actions}>
        <JobActionsMenu
          job={job}
          userPermissionsOnIntegration={userPermissionsOnIntegration}
          integrationName={integrationName}
        />
      </TableCell>
    </TableRow>
  );
}
