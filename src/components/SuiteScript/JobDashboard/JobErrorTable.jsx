import React, { useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import TablePagination from '@mui/material/TablePagination';
import { Spinner, OutlinedButton } from '@celigo/fuse-ui';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import CeligoTable from '../../CeligoTable';
import JobErrorMessage from './JobErrorMessage';
import DateTimeDisplay from '../../DateTimeDisplay';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import ActionGroup from '../../ActionGroup';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right'},
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
  info: {
    color: theme.palette.info.main,
  },
  darkGray: {
    color: theme.palette.text.secondary,
  },
  errorMessageTable: {
    width: '100%',
  },
}));

const useColumns = () => [
  {
    key: 'message',
    heading: 'Message',
    // eslint-disable-next-line react/display-name
    Value: ({rowData: r}) => (
      <JobErrorMessage
        type={r.type}
        message={r.message}
        recordLink={r.recordLink}
      />
    ),
  },
  {
    key: 'time',
    heading: 'Time',
    isLoggable: true,
    // eslint-disable-next-line react/display-name
    Value: ({rowData: r}) => <DateTimeDisplay dateTime={r.createdAt} />,
  },
];

export default function JobErrorTable({
  rowsPerPage = 10,
  jobErrors,
  job,
  onCloseClick,
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedErrors, setSelectedErrors] = useState({});
  const selectedErrorIds = Object.keys(selectedErrors).filter(
    jobErrorId => !!selectedErrors[jobErrorId]
  );
  const hasUnresolvedErrors =
    jobErrors && jobErrors.filter(je => !je.resolved).length > 0;
  const jobErrorsInCurrentPage = jobErrors
    ? jobErrors.slice(
      currentPage * rowsPerPage,
      (currentPage + 1) * rowsPerPage
    )
    : [];
  const hasUnresolvedErrorsInCurrentPage =
    jobErrorsInCurrentPage.filter(je => !je.resolved).length > 0;
  const numSelectedResolvableErrors = jobErrors
    ? jobErrors.filter(je => selectedErrorIds.includes(je._id) && !je.resolved)
      .length
    : 0;
  const additionalHeaders = useSelector(
    state => selectors.accountShareHeader(state, ''),
    shallowEqual
  );

  function handleChangePage(event, newPage) {
    setCurrentPage(newPage);
  }

  function handleResolveClick() {
    if (selectedErrorIds.length === 0) {
      const jobsToResolve = [
        {
          jobId: job._id,
          jobType: job.type,
          log: job.log,
        },
      ];

      dispatch(
        actions.suiteScript.job.resolveSelected({
          ssLinkedConnectionId,
          integrationId,
          flowId: job._flowId,
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
              dispatch(actions.suiteScript.job.resolveUndo(job))
            );

            return false;
          }

          dispatch(
            actions.suiteScript.job.resolveCommit({
              jobs: jobsToResolve,
            })
          );
        },
      });
      onCloseClick();
    } else {
      dispatch(
        actions.suiteScript.job.resolveSelectedErrors({
          ssLinkedConnectionId,
          integrationId,
          jobId: job._id,
          jobType: job.type,
          selectedErrorIds,
        })
      );
      setSelectedErrors({});
    }
  }

  function handleDownloadAllErrorsClick() {
    let downloadUrl = `/api/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${job._id}/download?jobType=${job.type}&fileType=error`;

    if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
      downloadUrl += `&integrator-ashareid=${
        additionalHeaders['integrator-ashareid']
      }`;
    }

    openExternalUrl({ url: downloadUrl });
  }

  const handleJobErrorSelectChange = selected => {
    setSelectedErrors(selected);
  };

  return (
    <>
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
          Duration: <span className={classes.darkGray}>{job.duration}</span>
        </li>
        <li>
          Completed:
          <span className={classes.darkGray}>
            <DateTimeDisplay dateTime={job.endedAt} />
          </span>
        </li>
      </ul>
      {!jobErrors ? (
        <Spinner center="screen" >Loading</Spinner>
      ) : (
        <>
          <ActionGroup className={classes.btnsWrappper}>
            <OutlinedButton
              data-test="markResolvedJobs"
              color="secondary"
              onClick={handleResolveClick}
              disabled={!hasUnresolvedErrors}>
              {numSelectedResolvableErrors > 0
                ? `Mark resolved ${numSelectedResolvableErrors} errors`
                : 'Mark resolved'}
            </OutlinedButton>
            { job.errorFileId && (
            <OutlinedButton
              color="secondary"
              data-test="downloadAllErrors"
              onClick={handleDownloadAllErrorsClick}>
              Download all errors
            </OutlinedButton>
            )}
          </ActionGroup>

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
            // onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />

            <CeligoTable
              data={jobErrorsInCurrentPage}
              selectableRows={hasUnresolvedErrorsInCurrentPage}
              isSelectableRow={r => !r.resolved}
              onSelectChange={handleJobErrorSelectChange}
              useColumns={useColumns}
              className={classes.errorMessageTable}
          />
          </>
        </>
      )}
    </>
  );
}

