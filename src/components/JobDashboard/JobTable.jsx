import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import { difference } from 'lodash';
import JobDetail from './JobDetail';
import { JOB_STATUS } from '../../utils/constants';
import JobErrorDialog from './JobErrorDialog';
import * as selectors from '../../reducers';

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
  onChangePage,
}) {
  const classes = useStyles();
  const { paging, totalJobs } = useSelector(state =>
    selectors.flowJobsPagingDetails(state)
  );
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

  function handleChangePage(event, newPage) {
    // setCurrentPage(newPage);
    onChangePage(newPage);
  }

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

  function handleViewErrorsClick({ jobId, parentJobId, showResolved = false }) {
    setShowErrorDialogFor({ jobId, parentJobId, showResolved });
  }

  function handleJobErrorDialogCloseClick() {
    setShowErrorDialogFor({});
  }

  return (
    <Fragment>
      <TablePagination
        classes={{ root: classes.tablePaginationRoot }}
        rowsPerPageOptions={[paging.rowsPerPage]}
        component="div"
        count={totalJobs || 0}
        rowsPerPage={paging.rowsPerPage}
        page={paging.currentPage}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onChangePage={handleChangePage}
        // onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />

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
            />
          ))}
        </TableBody>
      </Table>
      {showErrorDialogFor.jobId && (
        <JobErrorDialog
          jobId={showErrorDialogFor.jobId}
          parentJobId={showErrorDialogFor.parentJobId}
          showResolved={showErrorDialogFor.showResolved}
          onCloseClick={handleJobErrorDialogCloseClick}
          integrationName={integrationName}
        />
      )}
    </Fragment>
  );
}

export default JobTable;
