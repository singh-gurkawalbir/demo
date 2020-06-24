import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '../icons/EditIcon';
import ChevronRight from '../icons/ArrowRightIcon';
import ExpandMore from '../icons/ArrowDownIcon';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import JsonEditorDialog from '../JsonEditorDialog';
import * as selectors from '../../reducers';
import Spinner from '../Spinner';
import CeligoTable from '../CeligoTable';
import JobErrorMessage from './JobErrorMessage';
import { JOB_STATUS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';
import DateTimeDisplay from '../DateTimeDisplay';
import ButtonsGroup from '../ButtonGroup';
import useConfirmDialog from '../ConfirmDialog';
import JobErrorPreviewDialogContent from './JobErrorPreviewDialogContent';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right' },
  fileInput: { display: 'none' },
  spinner: {
    left: 0,
    right: 0,
    top: -40,
    bottom: 0,
    width: '100%',
    position: 'absolute',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'inherit',
    zIndex: '3',
    '& span': {
      marginLeft: '10px',
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
  const { confirmDialog } = useConfirmDialog();
  const [currentPage, setCurrentPage] = useState(0);
  const [fileId] = useState(generateNewId());
  const uploadFileRef = useRef(null);
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
  // #region derived props from selectors
  const retryObject = useSelector(state => {
    if (!editDataOfRetryId) {
      return undefined;
    }

    return selectors.jobErrorRetryObject(state, editDataOfRetryId);
  });
  const uploadedFile = useSelector(
    state => selectors.getUploadedFile(state, fileId),
    shallowEqual
  );
  const jobErrorsPreview = useSelector(
    state => selectors.getJobErrorsPreview(state, job._id),
    shallowEqual
  );
  // Extract errorFile Id from the target Job i.e., one of the children of parent job ( job._flowJobId )
  const existingErrorFileId = useSelector(state => {
    const { children = [] } =
      selectors.flowJob(state, { jobId: job._flowJobId }) || {};
    const childJob = children.find(cJob => cJob._id === job._id) || {};

    return childJob.errorFile && childJob.errorFile.id;
  });
  // #end region
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

  const handleUploadProcessedErrors = useCallback(() => {
    uploadFileRef.current.value = '';
    uploadFileRef.current.click();
  }, []);
  const handleFileChosen = useCallback(
    event => {
      const file = event.target.files[0];

      if (!file) return;

      // If file name uploaded matches the existing fileId with csv extension, process right away
      // File name is preferred not to be changed
      if (file.name === `${existingErrorFileId}.csv`) {
        dispatch(actions.file.processFile({ fileId, file, fileType: 'csv' }));

        return;
      }

      // else take the confirmation from the user for the same and proceed if yes
      confirmDialog({
        title: 'Confirm upload',
        message: 'Are you sure you want to proceed with this upload? The name of the file you are uploading does not match the name of the latest file associated with this job. We strongly recommend that you always work from the most recent file.',
        buttons: [
          {
            label: 'Upload',
            onClick: () => {
              dispatch(
                actions.file.processFile({ fileId, file, fileType: 'csv' })
              );
            },
          },
          {
            label: 'Cancel',
          },
        ],
      });
    },
    [confirmDialog, dispatch, existingErrorFileId, fileId]
  );

  function handleRetryClick() {
    if (selectedErrorIds.length === 0) {
      const jobsToRetry = [{ _flowJobId: job._flowJobId, _id: job._id }];

      dispatch(
        actions.job.retrySelected({
          jobs: jobsToRetry,
        })
      );
      enqueueSnackbar({
        message: `${
          job.numError === '1' ? 'error retried.' : 'errors retried.'
        }`,
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

  useEffect(() => {
    if (editDataOfRetryId && (!retryObject || !retryObject.retryData)) {
      dispatch(actions.job.requestRetryData({ retryId: editDataOfRetryId }));
    }
  }, [dispatch, editDataOfRetryId, retryObject]);

  useEffect(() => {
    const { status, error, file: errorFile } = uploadedFile || {};

    switch (status) {
      case 'error':
        enqueueSnackbar({
          message: error,
          variant: 'error',
        });
        break;
      case 'received':
        // request for preview on uploaded errors file for this job
        dispatch(
          actions.job.processedErrors.requestPreview({
            jobId: job._id,
            errorFile,
          })
        );
        // reset file session as it is no longer needed
        dispatch(actions.file.reset(fileId));
        break;
      default:
    }
  }, [
    dispatch,
    enqueueSnackbar,
    fileId,
    job._flowJobId,
    job._id,
    uploadedFile,
  ]);

  useEffect(() => {
    const { status, previewData, errorFileId } = jobErrorsPreview || {};

    if (status === 'received' && previewData) {
      confirmDialog({
        title:
          'Uploading this error file will result in the following. Please confirm to proceed',
        message: <JobErrorPreviewDialogContent previewData={previewData} />,
        maxWidth: 'md',
        buttons: [
          {
            label: 'Proceed',
            onClick: () => {
              // dispatch action that retries this current job with uploaded file stored at s3Key
              dispatch(
                actions.job.retryForProcessedErrors({
                  jobId: job._id,
                  flowJobId: job._flowJobId,
                  errorFileId,
                })
              );
              // Once retried with uploaded processedErrors, the main error table dialog can be closed
              onCloseClick();
            },
          },
          {
            label: 'Cancel',
          },
        ],
      });
      // Once the dialog is open, clear the preview result as it is no longer needed
      dispatch(actions.job.processedErrors.clearPreview(job._id));
    }
  }, [
    confirmDialog,
    dispatch,
    job._flowJobId,
    job._id,
    jobErrorsPreview,
    onCloseClick,
  ]);

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
    <>
      {editDataOfRetryId &&
        (retryObject && retryObject.retryData ? (
          <JsonEditorDialog
            onChange={handleRetryDataChange}
            onClose={handleRetryDataEditorClose}
            value={retryObject.retryData.data}
            title="Edit retry data"
            id={editDataOfRetryId}
          />
        ) : (
          <div className={classes.spinner}>
            <Spinner size={20} /> <span>Loading retry data...</span>
          </div>
        ))}
      {jobErrorsPreview && jobErrorsPreview.status === 'requested' && (
        <div className={classes.spinner}>
          <Spinner size={20} /> <span>Uploading...</span>
        </div>
      )}
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
        <>
          <ButtonsGroup className={classes.btnsWrappper}>
            <Button
              data-test="retryErroredJobs"
              variant="outlined"
              color="secondary"
              onClick={handleRetryClick}
              disabled={isJobInProgress || !hasRetriableErrors}>
              {numSelectedRetriableErrors > 0
                ? `Retry ${numSelectedRetriableErrors} error${numSelectedRetriableErrors === 1 ? '' : 's'}`
                : `${isJobInProgress ? 'Retrying' : 'Retry all'}`}
            </Button>
            <Button
              data-test="markResolvedJobs"
              variant="outlined"
              color="secondary"
              onClick={handleResolveClick}
              disabled={isJobInProgress || !hasUnresolvedErrors}>
              {numSelectedResolvableErrors > 1
                ? `Mark resolved ${numSelectedResolvableErrors} errors`
                : `${
                  numSelectedResolvableErrors === 1
                    ? `Mark resolved ${numSelectedResolvableErrors} error`
                    : 'Mark resolved'
                }`}
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
              disabled={isJobInProgress}
              onClick={handleUploadProcessedErrors}>
              Upload processed errors
            </Button>
            <input
              data-test="uploadFile"
              id="fileUpload"
              type="file"
              ref={uploadFileRef}
              className={classes.fileInput}
              onChange={handleFileChosen}
            />
          </ButtonsGroup>

          {jobErrorsInCurrentPage.length === 0 ? (
            <>
              <div>
                Please use the &apos;Download All Errors&apos; button above to
                view the errors for this job.
              </div>
            </>
          ) : (
            <>
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
                  r.metadata && r.metadata.isParent && !r.resolved}
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
                // TODO : @Raghu Need to refactor.. Move all this metadata stuff out of this JSX
                rowActions={r => {
                  if (!(r.metadata &&
                    r.metadata.isParent &&
                    r.retryObject &&
                    r.retryObject.isDataEditable)) return [];
                  return [
                    {
                      icon: <EditIcon />,
                      label: 'Edit retry data',
                      component: function EditRetryData() {
                        useEffect(() => {
                          handleEditRetryDataClick(r._retryId);
                        }, []);
                        return null;
                      },
                    },
                  ];
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
}

export default JobErrorTable;
