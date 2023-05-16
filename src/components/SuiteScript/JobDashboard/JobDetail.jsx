import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { TextButton } from '@celigo/fuse-ui';
import { JOB_STATUS } from '../../../constants';
import JobStatus from './JobStatus';
import { getSuccess } from './util';
import JobActionsMenu from './JobActionsMenu';
import DateTimeDisplay from '../../DateTimeDisplay';
import { JobDetailsStyles } from '../../JobDashboard/ChildJobDetail';

const useStyles = makeStyles(() => ({
  checkAction: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 0 24px',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  checkIcon: {
    padding: 0,
  },
  error: {
    textAlign: 'right',
  },
  stateBtn: {
    float: 'right',
    padding: 0,
    minWidth: 'unset',
  },
  checkActionBorder: {
    paddingLeft: '13px',
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
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();
  const [showViewErrorsLink, setShowViewErrorsLink] = useState(false);
  const isSelected = !!(
    selectedJobs[`${job.type}-${job._id}`] &&
    selectedJobs[`${job.type}-${job._id}`].selected
  );
  const isJobInProgress = [JOB_STATUS.QUEUED, JOB_STATUS.RUNNING].includes(
    job.status
  );

  function handleSelectChange(event) {
    const { checked } = event.target;
    const jobIds = { ...selectedJobs };
    const currJob = jobIds[`${job.type}-${job._id}`] || {};

    currJob.selected = checked;
    currJob.log = job.log;

    onSelectChange(currJob, job._id, job.type);
  }

  function handleViewErrorsClick() {
    onViewErrorsClick({
      jobId: job._id,
      jobType: job.type,
      numError: job.numError,
    });
  }

  return (
    <>
      <TableRow>
        <TableCell
          className={clsx(
            {
              [classes.checkActionBorder]: isSelected,
              [jobDetailsClasses.checkActionBorder]: isSelected,
            },
            classes.checkFlow
          )}>
          <ul className={clsx(classes.checkAction, jobDetailsClasses.checkAction)}>
            <li>
              <Checkbox
                disabled={!job.numError}
                checked={isSelected}
                className={clsx(classes.checkIcon, jobDetailsClasses.checkIcon)}
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
        <TableCell className={classes.ignore}>0</TableCell>
        <TableCell
          onMouseEnter={() => {
            setShowViewErrorsLink(true);
          }}
          onMouseLeave={() => {
            setShowViewErrorsLink(false);
          }}
          className={clsx(classes.error, jobDetailsClasses.error, {
            [classes.errorCount]: job.numError > 0,
          })}>
          {showViewErrorsLink && !isJobInProgress && job.numError > 0 ? (
            <TextButton
              error
              data-test="viewJobErrors"
              bold
              className={clsx(classes.stateBtn, jobDetailsClasses.stateBtn)}
              onClick={() => {
                handleViewErrorsClick(false);
              }}>
              View
            </TextButton>
          ) : (
            job.numError
          )}
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
            isFlowBuilderView={isFlowBuilderView}
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
