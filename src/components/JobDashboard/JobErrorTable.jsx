import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Link, useRouteMatch} from 'react-router-dom';
import { TablePagination, IconButton, Tooltip, Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner, OutlinedButton } from '@celigo/fuse-ui';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { JOB_STATUS } from '../../constants';
import { generateNewId } from '../../utils/resource';
import EditIcon from '../icons/EditIcon';
import ChevronRight from '../icons/ArrowRightIcon';
import ExpandMore from '../icons/ArrowDownIcon';
import CeligoTable from '../CeligoTable';
import DateTimeDisplay from '../DateTimeDisplay';
import useConfirmDialog from '../ConfirmDialog';
import JobErrorPreviewDialogContent from './JobErrorPreviewDialogContent';
import JobErrorMessage from './JobErrorMessage';
import { UNDO_TIME } from '../../utils/jobdashboard';
import DownloadIcon from '../icons/DownloadIcon';
import ActionGroup from '../ActionGroup';
import { getTextAfterCount } from '../../utils/string';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';
import { message } from '../../utils/messageStore';
import customCloneDeep from '../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right' },
  fileInput: { display: 'none' },
  btnsWrappper: {
    marginTop: theme.spacing(1),
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
  resolved: {
    color: theme.palette.info.main,
  },
  darkGray: {
    color: theme.palette.text.secondary,
  },
  downloadOnlyDivider: {
    margin: theme.spacing(2),
  },
  celigoTableWrapper: {
    overflowX: 'auto',
    width: '100%',
    marginBottom: theme.spacing(5),
  },
  code: {
    wordBreak: 'break-word',
  },
}));

export default function JobErrorTable({
  rowsPerPage = 50,
  jobErrors,
  errorCount,
  job,
  onCloseClick,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
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
  // const [editDataOfRetryId, setEditDataOfRetryId] = useState();
  const [expanded, setExpanded] = useState({});

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
      selectors.flowJob(state, { jobId: job._parentJobId || job._flowJobId }) || {};
    const childJob = children.find(cJob => cJob._id === job._id) || {};

    return childJob.errorFile && childJob.errorFile.id;
  });

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
        message: message.JOBS.CONFIRM_UPLOAD,
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
            variant: 'text',
          },
        ],
      });
    },
    [confirmDialog, dispatch, existingErrorFileId, fileId]
  );

  function handleRetryClick() {
    if (selectedErrorIds.length === 0) {
      const jobsToRetry = [{ _flowJobId: job._parentJobId || job._flowJobId, _id: job._id }];

      dispatch(
        actions.job.retrySelected({
          jobs: jobsToRetry,
          match,
        })
      );
      enqueueSnackbar({
        message: `${job.numError} ${
          job.numError === '1' ? 'error retried.' : 'errors retried.'
        }`,
        showUndo: true,
        autoHideDuration: UNDO_TIME.RETRY,
        handleClose(event, reason) {
          if (reason === 'undo') {
            jobsToRetry.forEach(job =>
              dispatch(
                actions.job.retryUndo({
                  parentJobId: job._parentJobId || job._flowJobId || job._id,
                  childJobId: (job._parentJobId || job._flowJobId) ? job._id : null,
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
          flowJobId: job._parentJobId || job._flowJobId,
          selectedRetryIds,
          match,
        })
      );
      onCloseClick();
    }
  }

  function handleResolveClick() {
    if (selectedErrorIds.length === 0) {
      const jobsToResolve = [{ _flowJobId: job._parentJobId || job._flowJobId, _id: job._id }];

      dispatch(
        actions.job.resolveSelected({
          jobs: jobsToResolve,
          match,
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
                  parentJobId: job._parentJobId || job._flowJobId || job._id,
                  childJobId: job._parentJobId || job._flowJobId ? job._id : null,
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
          flowJobId: job._parentJobId || job._flowJobId,
          selectedErrorIds,
          match,
        })
      );
    }
  }

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
                  flowJobId: job._parentJobId || job._flowJobId,
                  errorFileId,
                })
              );
              // Once retried with uploaded processedErrors, the main error table dialog can be closed
              onCloseClick();
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
      // Once the dialog is open, clear the preview result as it is no longer needed
      dispatch(actions.job.processedErrors.clearPreview(job._id));
    }
  }, [confirmDialog, dispatch, job._flowJobId, job._id, job._parentJobId, jobErrorsPreview, onCloseClick]);

  const handleExpandCollapseClick = errorId => {
    setExpanded({ ...expanded, [errorId]: !expanded[errorId] });
  };

  const handleJobErrorSelectChange = selected => {
    setSelectedErrors(selected);
  };

  function EditRetryCell({retryId, isEditable, isDownloadable}) {
    const dispatch = useDispatch();
    const handleDownloadRetry = useCallback(() => {
      dispatch(
        actions.job.downloadRetryData({
          retryId,
        })
      );
    }, [dispatch, retryId]);

    if (!isEditable && !isDownloadable) return null;

    return isDownloadable ? (
      <Tooltip title="Download retry data">
        <IconButton
          component={Link}
          size="small"
          data-test="download-retry"
          onClick={handleDownloadRetry}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip title="Edit retry data">
        <IconButton
          component={Link}
          size="small"
          data-test="edit-retry"
          to={buildDrawerUrl({
            path: drawerPaths.ERROR_MANAGEMENT.V1.JOB_EDIT_RETRY,
            baseUrl: match.url,
            params: { retryId },
          })}>
          <EditIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      {jobErrorsPreview && jobErrorsPreview.status === 'requested' && (
      <Spinner center="screen" >
        Uploading...
      </Spinner>
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
          Resolved: <span className={classes.resolved}>{job.numResolved}</span>
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

        <Spinner center="screen" >
          Loading job errors
        </Spinner>

      ) : (
        <>
          <ActionGroup className={classes.btnsWrappper}>
            <OutlinedButton
              data-test="retryErroredJobs"
              color="secondary"
              onClick={handleRetryClick}
              disabled={isJobInProgress || !hasRetriableErrors || job.flowDisabled}>
              { !job.flowDisabled && numSelectedRetriableErrors > 0
                ? `Retry ${getTextAfterCount('error', numSelectedRetriableErrors)}`
                : `${isJobInProgress ? 'Retrying' : 'Retry all'}`}
            </OutlinedButton>
            <OutlinedButton
              data-test="markResolvedJobs"
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
            </OutlinedButton>
            <OutlinedButton
              data-test="downloadAllErrors"
              color="secondary"
              onClick={handleDownloadAllErrorsClick}
              disabled={isJobInProgress}>
              Download all errors
            </OutlinedButton>
            <OutlinedButton
              data-test="uploadProcessedErrors"
              color="secondary"
              disabled={isJobInProgress}
              onClick={handleUploadProcessedErrors}>
              Upload processed errors
            </OutlinedButton>
            <input
              data-test="uploadFile"
              id="fileUpload"
              type="file"
              ref={uploadFileRef}
              className={classes.fileInput}
              onChange={handleFileChosen}
          />
          </ActionGroup>

          {jobErrorsInCurrentPage.length === 0 ? (
            <>
              <Divider className={classes.downloadOnlyDivider} />
              <Typography>
                Please use the &apos;Download all errors&apos; button above to
                view the errors for this job.
              </Typography>
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
                onPageChange={handleChangePage}
            />

              <CeligoTable
                className={classes.celigoTableWrapper}
                data={customCloneDeep(jobErrorsData)}
                selectableRows={
                !isJobInProgress && hasUnresolvedErrorsInCurrentPage
              }
                isSelectableRow={r =>
                  r.metadata && r.metadata.isParent && !r.resolved}
                onSelectChange={handleJobErrorSelectChange}
                useColumns={() => [
                  {
                    key: 'expandClick',
                    heading: '',
                    isLoggable: true,
                    Value: ({rowData: r}) =>
                    r.similarErrors?.length > 0 && (
                      <IconButton
                        data-test="expandJobsErrors"
                        onClick={() => {
                          handleExpandCollapseClick(r._id);
                        }}
                        size="large">
                        {r.metadata?.expanded ? (
                          <ExpandMore />
                        ) : (
                          <ChevronRight />
                        )}
                      </IconButton>
                      ),
                  },
                  {
                    key: 'resolved',
                    heading: 'Resolved?',
                    align: 'center',
                    isLoggable: true,
                    Value: ({rowData: r}) => r.resolved
                      ? (<span className={classes.resolved}>Yes</span>)
                      : (<span className={classes.error}>No</span>),
                  },
                  {
                    key: 'source',
                    heading: 'Source',
                    width: '15%',
                    Value: ({rowData: r}) => r.source && (<span className={classes.code}>{r.source}</span>),
                  },
                  {
                    key: 'code',
                    heading: 'Code',
                    align: 'left',
                    width: '15%',
                    Value: ({rowData: r}) => r.code && (<span className={classes.code}>{r.code}</span>),
                  },
                  {
                    key: 'message',
                    heading: 'Message',
                    width: '30%',
                    Value: ({rowData: r}) => (
                      <JobErrorMessage
                        message={r.message}
                        exportDataURI={r.exportDataURI}
                        importDataURI={r.importDataURI}
                    />
                    ),
                  },
                  {
                    key: 'time',
                    heading: 'Time',
                    width: '15%',
                    isLoggable: true,
                    Value: ({rowData: r}) => <DateTimeDisplay dateTime={r.createdAt} />,
                  },
                  {
                    key: 'retryData',
                    heading: 'Retry data',
                    align: 'center',
                    isLoggable: true,
                    Value: ({rowData: r}) => (
                      <EditRetryCell
                        retryId={r._retryId}
                        isEditable={r.metadata?.isParent &&
                    r.retryObject?.isDataEditable}
                        isDownloadable={r.retryObject?.isDownloadable}
                        dateTime={r.createdAt} />
                    ),
                  },
                ]}
            />
            </>
          )}
        </>
      )}
    </>
  );
}
