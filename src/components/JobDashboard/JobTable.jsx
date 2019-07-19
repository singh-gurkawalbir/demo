import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import * as selectors from '../../reducers';
import actions from '../../actions';
import JobDetail from './JobDetail';

const styles = theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
  createAPITokenButton: {
    margin: theme.spacing.unit,
    textAlign: 'center',
    float: 'right',
  },
  table: {
    minWidth: 700,
  },
  tablePaginationRoot: { float: 'left' },
});

function JobTable({
  classes,
  integrationId,
  flowId,
  filters,
  rowsPerPage = 10,
  onSelectChange,
}) {
  const dispatch = useDispatch();
  const jobs = useSelector(state =>
    selectors.flowJobList(state, integrationId, flowId)
  );

  window.JOBS = jobs;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(
    () => () => {
      dispatch(actions.job.clear());
    },
    [dispatch, filters]
  );

  useEffect(() => {
    if (!jobs.length) {
      dispatch(
        actions.job.requestCollection({ integrationId, flowId, filters })
      );
    }
  }, [dispatch, filters, flowId, integrationId, jobs.length]);

  const jobsInCurrentPage = jobs.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  function handleChangePage(event, newPage) {
    setCurrentPage(newPage);
  }

  function handleSelectChange(selected, jobId) {
    let jobIds = [...selectedJobs];

    if (selected) {
      jobIds.push(jobId);
    } else {
      const index = jobIds.indexOf(jobId);

      if (index > -1) {
        jobIds = [...jobIds.slice(0, index), ...jobIds.slice(index + 1)];
      }
    }

    setSelectedJobs(jobIds);

    onSelectChange(jobIds);
  }

  return (
    <Fragment>
      <TablePagination
        classes={{ root: classes.tablePaginationRoot }}
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={jobs.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
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
                // indeterminate={numSelected > 0 && numSelected < rowCount}
                // checked={numSelected === rowCount}
                // onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'Select all jobs' }}
              />
            </TableCell>
            <TableCell />
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
            />
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default withStyles(styles)(JobTable);
