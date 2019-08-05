import { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';

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
  table: {
    minWidth: 700,
  },
  tablePaginationRoot: { float: 'left' },
});

function JobErrorTable({
  classes,
  rowsPerPage = 10,
  jobErrors,
  job,
  onCloseClick,
}) {
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [currentPage, setCurrentPage] = useState(0);
  const jobErrorsInCurrentPage = jobErrors.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );
  const [selectedErrors, setSelectedErrors] = useState({});
  const selectableErrorsInCurrentPage = jobErrorsInCurrentPage.filter(
    je => !je.resolved
  );
  const isSelectAllChecked =
    selectableErrorsInCurrentPage.length > 0 &&
    selectableErrorsInCurrentPage.reduce(
      (isSelected, je) => isSelected && (selectedErrors[je._id] || false),
      true
    );
  const numSelectedJobs = Object.keys(selectedErrors).filter(
    jobErrorId => selectedErrors[jobErrorId]
  ).length;

  function handleChangePage(event, newPage) {
    setCurrentPage(newPage);
  }

  function handleSelectAllChange(event) {
    const { checked } = event.target;
    const errors = { ...selectedErrors };

    selectableErrorsInCurrentPage.forEach(je => {
      errors[je._id] = checked;
    });
    setSelectedErrors(errors);
  }

  function handleSelectChange(event, jobErrorId) {
    const { checked } = event.target;
    const errors = { ...selectedErrors };

    errors[jobErrorId] = checked;
    setSelectedErrors(errors);
  }

  function handleDownloadAllErrorsClick() {
    dispatch(actions.job.downloadErrorFile({ jobId: job._id }));
  }

  function handleRetryClick() {
    if (numSelectedJobs === 0) {
      const jobsToRetry = [{ _flowJobId: job._flowJobId, _id: job._id }];

      dispatch(
        actions.job.retrySelected({
          jobs: jobsToRetry,
        })
      );
      enqueueSnackbar({
        message: `${job.numError} errors retried.`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          if (reason === 'undo') {
            jobsToRetry.forEach(job =>
              dispatch(
                actions.job.retryUndo({
                  jobId: job._id,
                  parentJobId: job._flowJobId,
                })
              )
            );

            return false;
          }

          dispatch(
            actions.job.retryCommit({
              jobs: jobsToRetry,
            })
          );
        },
      });
      onCloseClick();
    }
  }

  function handleResolveClick() {
    if (numSelectedJobs === 0) {
      const jobsToResolve = [{ _flowJobId: job._flowJobId, _id: job._id }];

      dispatch(
        actions.job.resolveSelected({
          jobs: jobsToResolve,
        })
      );
      enqueueSnackbar({
        message: `${job.numError} errors marked as resolved.`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          if (reason === 'undo') {
            jobsToResolve.forEach(job =>
              dispatch(
                actions.job.resolveUndo({
                  jobId: job._id,
                  parentJobId: job._flowJobId,
                })
              )
            );

            return false;
          }

          dispatch(
            actions.job.resolveCommit({
              jobs: jobsToResolve,
            })
          );
        },
      });
      onCloseClick();
    } else {
      const selectedErrorIds = Object.keys(selectedErrors).filter(
        jobErrorId => selectedErrors[jobErrorId]
      );

      dispatch(
        actions.job.resolveSelectedErrors({
          jobId: job._id,
          flowJobId: job._flowJobId,
          selectedErrorIds,
        })
      );
    }
  }

  return (
    <Fragment>
      <Typography>
        Success: {job.numSuccess} Ignore: {job.numIgnore} Error: {job.numError}{' '}
        Resolved: {job.numResolved} Duration: {job.duration} Completed:{' '}
        {job.endedAtAsString}
      </Typography>
      <Fragment>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRetryClick}
          disabled={job.numError === 0}>
          {numSelectedJobs > 0
            ? `Retry ${numSelectedJobs} Errors`
            : 'Retry All'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleResolveClick}
          disabled={job.numError === 0}>
          {numSelectedJobs > 0
            ? `Mark Resolved ${numSelectedJobs} Errors`
            : 'Mark Resolved'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAllErrorsClick}>
          Download All Errors
        </Button>
        <Button variant="contained" color="primary">
          Upload Processed Errors
        </Button>
      </Fragment>
      <TablePagination
        classes={{ root: classes.tablePaginationRoot }}
        rowsPerPageOptions={[rowsPerPage]}
        component="div"
        count={jobErrors.length}
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
                disabled={jobErrors.length === 0}
                checked={isSelectAllChecked}
                onChange={handleSelectAllChange}
                inputProps={{ 'aria-label': 'Select all errors' }}
              />
            </TableCell>
            <TableCell>Resolved?</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Retry Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobErrorsInCurrentPage.map(jobError => (
            <TableRow key={jobError._id}>
              <TableCell padding="checkbox">
                {!jobError.resolved && (
                  <Checkbox
                    checked={!!selectedErrors[jobError._id]}
                    onChange={event => handleSelectChange(event, jobError._id)}
                  />
                )}
              </TableCell>
              <TableCell>{jobError.resolved ? 'Yes' : 'No'}</TableCell>
              <TableCell>{jobError.source}</TableCell>
              <TableCell>{jobError.code}</TableCell>
              <TableCell>{jobError.message}</TableCell>
              <TableCell>{jobError.createdAtAsString}</TableCell>
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default withStyles(styles)(JobErrorTable);
