import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { difference } from 'lodash';
import JobDetail from './JobDetail';
import { JOB_STATUS } from '../../../utils/constants';
import JobErrorDialog from './JobErrorDialog';

const useStyles = makeStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing(2),
    float: 'left',
  },
  table: {
    minWidth: 700,
    position: 'relative',
  },
  checkFlow: {
    paddingLeft: 40,
  },
  tablePaginationRoot: { float: 'right' },
  name: {
    width: '18.15%',
    wordBreak: 'break-word',
    [theme.breakpoints.down('md')]: {
      wordBreak: 'normal',
    },
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
    whiteSpace: 'no-wrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
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
  const classes = useStyles();
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
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.checkFlow}>
              <Checkbox
                disabled={jobsInCurrentPage.length === 0}
                checked={isSelectAllChecked}
                onChange={handleSelectAllChange}
                color="primary"
                inputProps={{ 'aria-label': 'Select all jobs' }}
              />
            </TableCell>
            <TableCell className={classes.name}>Flow</TableCell>
            <TableCell className={classes.status}>Status</TableCell>
            <TableCell className={classes.success}>Success</TableCell>
            <TableCell className={classes.ignore}>Ignored</TableCell>
            <TableCell className={classes.error}>Errors</TableCell>
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
