import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { difference } from 'lodash';
import clsx from 'clsx';
import JobDetail from './JobDetail';
import { JOB_STATUS } from '../../../constants';
import JobErrorDialog from './JobErrorDialog';
import { JobDetailsStyles } from '../../JobDashboard/ChildJobDetail';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    position: 'relative',
  },
  checkFlow: {
    paddingLeft: 40,
    width: '2%',
  },
  name: {
    wordBreak: 'break-word',
    [theme.breakpoints.down('lg')]: {
      wordBreak: 'normal',
    },
  },
  error: {
    textAlign: 'right',
  },
}));

export default function JobTable({
  ssLinkedConnectionId,
  integrationId,
  onSelectChange,
  jobsInCurrentPage,
  selectedJobs,
  userPermissionsOnIntegration,
  integrationName,
  isFlowBuilderView,
}) {
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();
  const [showErrorDialogFor, setShowErrorDialogFor] = useState({});
  const selectableJobsInCurrentPage = jobsInCurrentPage.filter(
    j =>
      [JOB_STATUS.COMPLETED, JOB_STATUS.FAILED, JOB_STATUS.CANCELED].includes(
        j.status
      ) && j.numError > 0
  );
  const selectableJobIdsInCurrentPage = selectableJobsInCurrentPage.map(
    j => `${j.type}-${j._id}`
  );
  const selectedJobIds = Object.keys(selectedJobs).filter(
    jobId => selectedJobs[jobId] && selectedJobs[jobId].selected
  );
  const isSelectAllChecked =
    selectableJobIdsInCurrentPage.length > 0 &&
    difference(selectableJobIdsInCurrentPage, selectedJobIds).length === 0;

  function handleSelectChange(job, jobId, jobType) {
    const jobIds = { ...selectedJobs, [`${jobType}-${jobId}`]: job };

    onSelectChange(jobIds);
  }

  function handleSelectAllChange(event) {
    const { checked } = event.target;
    const jobIds = { ...selectedJobs };

    selectableJobIdsInCurrentPage.forEach(jobId => {
      const job = jobIds[jobId] || {};

      job.selected = checked;

      jobIds[jobId] = job;
    });
    onSelectChange(jobIds);
  }

  function handleViewErrorsClick({ jobId, jobType, numError }) {
    setShowErrorDialogFor({
      jobId,
      jobType,
      numError,
    });
  }

  function handleJobErrorDialogCloseClick() {
    setShowErrorDialogFor({});
  }

  return (
    <>
      <Table className={clsx(classes.table, jobDetailsClasses.table)}>
        <TableHead>
          <TableRow>
            <TableCell className={clsx(classes.checkFlow, jobDetailsClasses.checkFlow)}>
              <Checkbox
                disabled={jobsInCurrentPage.length === 0}
                checked={isSelectAllChecked}
                onChange={handleSelectAllChange}
                color="primary"
                inputProps={{ 'aria-label': 'Select all jobs' }}
              />
            </TableCell>
            <TableCell className={clsx(classes.name, jobDetailsClasses.name)}>Flow</TableCell>
            <TableCell className={classes.status}>Status</TableCell>
            <TableCell className={classes.success}>Success</TableCell>
            <TableCell className={classes.ignore}>Ignored</TableCell>
            <TableCell className={clsx(classes.error, jobDetailsClasses.error)}>Errors</TableCell>
            <TableCell className={classes.duration}>Duration</TableCell>
            <TableCell className={classes.completed}>Completed</TableCell>
            <TableCell className={classes.actions}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-test={`${integrationName}Dashboard`}>
          {jobsInCurrentPage.map(job => (
            <JobDetail
              key={job._id}
              job={job}
              onSelectChange={handleSelectChange}
              selectedJobs={selectedJobs}
              userPermissionsOnIntegration={userPermissionsOnIntegration}
              onViewErrorsClick={handleViewErrorsClick}
              integrationName={integrationName}
              isFlowBuilderView={isFlowBuilderView}
              ssLinkedConnectionId={ssLinkedConnectionId}
              integrationId={integrationId}
            />
          ))}
        </TableBody>
      </Table>
      {showErrorDialogFor.jobId && (
        <JobErrorDialog
          jobId={showErrorDialogFor.jobId}
          jobType={showErrorDialogFor.jobType}
          numError={showErrorDialogFor.numError}
          onCloseClick={handleJobErrorDialogCloseClick}
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
        />
      )}
    </>
  );
}
