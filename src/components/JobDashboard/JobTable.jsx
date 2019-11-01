import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { difference } from 'lodash';
import JobDetail from './JobDetail';
import { JOB_STATUS } from '../../utils/constants';
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
  },
  tablePaginationRoot: { float: 'left' },
}));

function JobTable({
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
        j.uiStatus
      ) &&
      (j.retriable || j.numError > 0)
  );
  const selectableJobIdsInCurrentPage = selectableJobsInCurrentPage.map(
    j => j._id
  );
  const selectedJobIds = Object.keys(selectedJobs).filter(
    jobId => selectedJobs[jobId] && selectedJobs[jobId].selected
  );
  const isSelectAllChecked =
    selectableJobIdsInCurrentPage.length > 0 &&
    difference(selectableJobIdsInCurrentPage, selectedJobIds).length === 0;

  function handleSelectChange(job, jobId) {
    const jobIds = { ...selectedJobs, [jobId]: job };

    onSelectChange(jobIds);
  }

  function handleSelectAllChange(event) {
    const { checked } = event.target;
    const jobIds = { ...selectedJobs };

    selectableJobIdsInCurrentPage.forEach(jobId => {
      const job = jobIds[jobId] || {};

      job.selected = checked;

      if (!checked) {
        job.selectedChildJobIds = [];
      }

      jobIds[jobId] = job;
    });
    onSelectChange(jobIds);
  }

  function handleViewErrorsClick({
    jobId,
    parentJobId,
    showResolved = false,
    numError,
    numResolved,
  }) {
    setShowErrorDialogFor({
      jobId,
      parentJobId,
      showResolved,
      numError,
      numResolved,
    });
  }

  function handleJobErrorDialogCloseClick() {
    setShowErrorDialogFor({});
  }

  return (
    <Fragment>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                disabled={jobsInCurrentPage.length === 0}
                checked={isSelectAllChecked}
                onChange={handleSelectAllChange}
                color="primary"
                inputProps={{ 'aria-label': 'Select all jobs' }}
              />
            </TableCell>
            <TableCell>Flow</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Success</TableCell>
            <TableCell>Ignore</TableCell>
            <TableCell>Error</TableCell>
            <TableCell>Resolved</TableCell>
            <TableCell>Pages</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
            />
          ))}
        </TableBody>
      </Table>
      {showErrorDialogFor.jobId && (
        <JobErrorDialog
          jobId={showErrorDialogFor.jobId}
          parentJobId={showErrorDialogFor.parentJobId}
          showResolved={showErrorDialogFor.showResolved}
          numError={showErrorDialogFor.numError}
          numResolved={showErrorDialogFor.numResolved}
          onCloseClick={handleJobErrorDialogCloseClick}
          integrationName={integrationName}
        />
      )}
    </Fragment>
  );
}

export default JobTable;
