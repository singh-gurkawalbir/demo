import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EditIcon from '../icons/EditIcon';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import JsonEditorDialog from '../JsonEditorDialog';
import * as selectors from '../../reducers';
import Spinner from '../Spinner';
import CeligoTable from '../../components/CeligoTable';
import JobErrorMessage from './JobErrorMessage';
import { JOB_STATUS } from '../../utils/constants';
import DateTimeDisplay from '../DateTimeDisplay';
import ButtonsGroup from '../ButtonGroup';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right' },
  spinner: {
    left: '0px',
    right: '0px',
    top: '60px',
    bottom: '0px',
    background: 'rgba(106, 123, 137, 0.7)',
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    zIndex: '3',
    '& div': {
      color: theme.palette.background.paper,
    },
    '& span': {
      marginLeft: '10px',
      color: '#fff',
    },
  },
  btnsWrappper: {
    marginTop: theme.spacing(1),
    '& button': {
      marginRight: theme.spacing(2),
    },
  },
  statusWrapper: {
    display: 'flex',
    marginRight: theme.spacing(1),
    listStyle: 'none',
    padding: 0,
    margin: 0,
    '& li': {
      marginRight: theme.spacing(1),
    },
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  info: {
    color: theme.palette.info.main,
  },
  darkGray: {
    color: theme.palette.text.secondary,
  },
}));

function JobErrorTable({
  rowsPerPage = 10,
  jobErrors,
  errorCount,
  job,
  onCloseClick,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [currentPage, setCurrentPage] = useState(0);
  const isJobInProgress = job.status === JOB_STATUS.RETRYING;
  const hasRetriableErrors =
    jobErrors.filter(
      je =>
        !je.resolved &&
        je._retryId &&
        je.retryObject &&
        je.retryObject.isRetriable
    ).length > 0;
  const hasUnresolvedErrors = jobErrors.filter(je => !je.resolved).length > 0;
  const jobErrorsInCurrentPage = jobErrors.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );
  const hasUnresolvedErrorsInCurrentPage =
    jobErrorsInCurrentPage.filter(je => !je.resolved).length > 0;
  const [selectedErrors, setSelectedErrors] = useState({});
  const selectedErrorIds = Object.keys(selectedErrors).filter(
    jobErrorId => !!selectedErrors[jobErrorId]
  );
  const numSelectedResolvableErrors = jobErrors.filter(
    je => selectedErrorIds.includes(je._id) && !je.resolved
  ).length;
  const numSelectedRetriableErrors = jobErrors.filter(
    je =>
      selectedErrorIds.includes(je._id) &&
      !je.resolved &&
      je._retryId &&
      je.retryObject &&
      je.retryObject.isRetriable
  ).length;
  const [editDataOfRetryId, setEditDataOfRetryId] = useState();
  const [expanded, setExpanded] = useState({});
  const jobErrorsData = [];

  jobErrorsInCurrentPage.forEach(j => {
    jobErrorsData.push({
      ...j,
      metadata: { isParent: true, expanded: !!expanded[j._id] },
    });

    if (expanded[j._id]) {
      j.similarErrors.forEach(se => {
        jobErrorsData.push(se);
      });
    }
  });

  function handleChangePage(event, newPage) {
    setCurrentPage(newPage);
  }

  function handleDownloadAllErrorsClick() {
    dispatch(actions.job.downloadFiles({ jobId: job._id, fileType: 'errors' }));
  }

  function handleRetryClick() {
    if (selectedErrorIds.length === 0) {
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
    if (selectedErrorIds.length === 0) {
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

  const handleExpandCollapseClick = errorId => {
    setExpanded({ ...expanded, [errorId]: !expanded[errorId] });
  };

  const handleJobErrorSelectChange = selected => {
    setSelectedErrors(selected);
  };

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
            <Spinner size={20} /> <span>Loading retry data...</span>
          </div>
        ))}
      <ul className={classes.statusWrapper}>
        <li>
          Success: <span className={classes.success}>{job.numSuccess}</span>
        </li>
        <li>
          Ignore: <span>{job.numIgnore}</span>
        </li>
        <li>
          Error: <span className={classes.error}>{job.numError}</span>
        </li>
        <li>
          Resolved: <span className={classes.info}>{job.numResolved}</span>
        </li>
        <li>
          Duration: <span className={classes.darkGray}>{job.duration}</span>
        </li>
        <li>
          Completed:{' '}
          <span className={classes.darkGray}>
            <DateTimeDisplay dateTime={job.endedAt} />
          </span>
        </li>
      </ul>
      {errorCount < 1000 && jobErrorsInCurrentPage.length === 0 ? (
        <div className={classes.spinner}>
          <Spinner size={20} /> <span>Loading errors...</span>
        </div>
      ) : (
        <Fragment>
          <ButtonsGroup className={classes.btnsWrappper}>
            <Button
              data-test="retryErroredJobs"
              variant="outlined"
              color="secondary"
              onClick={handleRetryClick}
              disabled={isJobInProgress || !hasRetriableErrors}>
              {numSelectedRetriableErrors > 0
                ? `Retry ${numSelectedRetriableErrors} errors`
                : `${isJobInProgress ? 'Retrying' : 'Retry all'}`}
            </Button>
            <Button
              data-test="markResolvedJobs"
              variant="outlined"
              color="secondary"
              onClick={handleResolveClick}
              disabled={isJobInProgress || !hasUnresolvedErrors}>
              {numSelectedResolvableErrors > 0
                ? `Mark resolved ${numSelectedResolvableErrors} errors`
                : 'Mark resolved'}
            </Button>
            <Button
              data-test="downloadAllErrors"
              variant="outlined"
              color="secondary"
              onClick={handleDownloadAllErrorsClick}
              disabled={isJobInProgress}>
              Download all errors
            </Button>
            <Button
              data-test="uploadProcessedErrors"
              variant="outlined"
              color="secondary"
              disabled={isJobInProgress}>
              Upload processed errors
            </Button>
          </ButtonsGroup>

          {jobErrorsInCurrentPage.length === 0 ? (
            <Fragment>
              <div>
                Please use the &apos;Download All Errors&apos; button above to
                view the errors for this job.
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <TablePagination
                classes={{ root: classes.tablePaginationRoot }}
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                rowsPerPage={rowsPerPage}
                count={jobErrors.length}
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

              <CeligoTable
                data={jobErrorsData}
                selectableRows={
                  !isJobInProgress && hasUnresolvedErrorsInCurrentPage
                }
                isSelectableRow={r =>
                  r.metadata && r.metadata.isParent && !r.resolved
                }
                onSelectChange={handleJobErrorSelectChange}
                columns={[
                  {
                    heading: '',
                    value: r =>
                      r.similarErrors &&
                      r.similarErrors.length > 0 && (
                        <IconButton
                          data-test="expandJobsErrors"
                          onClick={() => {
                            handleExpandCollapseClick(r._id);
                          }}>
                          {r.metadata && r.metadata.expanded ? (
                            <ExpandMore />
                          ) : (
                            <ChevronRight />
                          )}
                        </IconButton>
                      ),
                  },
                  {
                    heading: 'Resolved?',
                    value: r => (r.resolved ? 'Yes' : 'No'),
                  },
                  {
                    heading: 'Source',
                    value: r => r.source,
                  },
                  {
                    heading: 'Code',
                    value: r => r.code,
                  },
                  {
                    heading: 'Message',
                    // eslint-disable-next-line react/display-name
                    value: r => (
                      <JobErrorMessage
                        message={r.message}
                        exportDataURI={r.exportDataURI}
                        importDataURI={r.importDataURI}
                      />
                    ),
                  },
                  {
                    heading: 'Time',
                    // eslint-disable-next-line react/display-name
                    value: r => <DateTimeDisplay dateTime={r.createdAt} />,
                  },
                ]}
                rowActions={r => [
                  {
                    label: 'Edit Retry Data',
                    component: function EditRetryData() {
                      return (
                        <Fragment>
                          {r.metadata &&
                            r.metadata.isParent &&
                            r.retryObject &&
                            r.retryObject.isDataEditable && (
                              <IconButton
                                data-test="editRetryData"
                                size="small"
                                onClick={() => {
                                  handleEditRetryDataClick(r._retryId);
                                }}>
                                <EditIcon />
                              </IconButton>
                            )}
                        </Fragment>
                      );
                    },
                  },
                ]}
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default JobErrorTable;
