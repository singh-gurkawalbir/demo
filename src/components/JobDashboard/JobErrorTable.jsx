import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import JsonEditorDialog from '../JsonEditorDialog';
import * as selectors from '../../reducers';
import Spinner from '../Spinner';

const styles = theme => ({
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
  spinner: {
    left: '0px',
    right: '0px',
    top: '60px',
    bottom: '0px',
    background: 'rgba(0,0,0,0.7)',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    zIndex: '3',
    '& div': {
      width: '20px !important',
      height: '20px !important',
    },
    '& span': {
      marginLeft: '10px',
      color: '#fff',
    },
  },
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
  const [editDataOfRetryId, setEditDataOfRetryId] = useState();

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
                  parentJobId: job._flowJobId || job._id,
                  childJobId: job._flowJobId ? job._id : null,
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
    } else {
      const selectedErrorIds = Object.keys(selectedErrors).filter(
        jobErrorId => selectedErrors[jobErrorId]
      );
      const selectedRetryIds = [];

      jobErrors.forEach(je => {
        if (selectedErrorIds.includes(je._id)) {
          if (je.retryObject && je.retryObject.isRetriable) {
            selectedRetryIds.push(je._retryId);
          }
        }
      });

      dispatch(
        actions.job.retrySelectedRetries({
          jobId: job._id,
          flowJobId: job._flowJobId,
          selectedRetryIds,
        })
      );
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
                  parentJobId: job._flowJobId || job._id,
                  childJobId: job._flowJobId ? job._id : null,
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

  function handleEditRetryDataClick(retryId) {
    setEditDataOfRetryId(retryId);
  }

  const retryObject = useSelector(state => {
    if (!editDataOfRetryId) {
      return undefined;
    }

    return selectors.jobErrorRetryObject(state, editDataOfRetryId);
  });

  useEffect(() => {
    if (editDataOfRetryId && (!retryObject || !retryObject.retryData)) {
      dispatch(actions.job.requestRetryData({ retryId: editDataOfRetryId }));
    }
  }, [dispatch, editDataOfRetryId, retryObject]);

  function handleRetryDataChange(data) {
    const updatedData = { ...retryObject.retryData, data };

    dispatch(
      actions.job.updateRetryData({
        retryId: editDataOfRetryId,
        retryData: updatedData,
      })
    );
  }

  function handleRetryDataEditorClose() {
    setEditDataOfRetryId();
  }

  return (
    <Fragment>
      {editDataOfRetryId &&
        (retryObject && retryObject.retryData ? (
          <JsonEditorDialog
            onChange={handleRetryDataChange}
            onClose={handleRetryDataEditorClose}
            value={retryObject.retryData.data}
            title="Edit Retry Data"
            id={editDataOfRetryId}
          />
        ) : (
          <div className={classes.spinner}>
            <Spinner /> <span>Loading retry data...</span>
          </div>
        ))}
      <Typography>
        Success: {job.numSuccess} Ignore: {job.numIgnore} Error: {job.numError}{' '}
        Resolved: {job.numResolved} Duration: {job.duration} Completed:{' '}
        {job.endedAtAsString}
      </Typography>
      {jobErrorsInCurrentPage.length === 0 ? (
        <div className={classes.spinner}>
          <Spinner /> <span>Loading errors...</span>
        </div>
      ) : (
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
                        onChange={event =>
                          handleSelectChange(event, jobError._id)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>{jobError.resolved ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{jobError.source}</TableCell>
                  <TableCell>{jobError.code}</TableCell>
                  <TableCell>{jobError.message}</TableCell>
                  <TableCell>{jobError.createdAtAsString}</TableCell>
                  <TableCell>
                    {jobError.retryObject &&
                      jobError.retryObject.isDataEditable && (
                        <Button
                          variant="text"
                          onClick={() =>
                            handleEditRetryDataClick(jobError._retryId)
                          }>
                          Edit
                        </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Fragment>
      )}
    </Fragment>
  );
}

export default withStyles(styles)(JobErrorTable);
