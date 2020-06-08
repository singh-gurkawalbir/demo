import { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { UNDO_TIME } from './util';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import CeligoTable from '../../../components/CeligoTable';
import JobErrorMessage from './JobErrorMessage';
import { JOB_STATUS } from '../../../utils/constants';
import DateTimeDisplay from '../../DateTimeDisplay';
import ButtonsGroup from '../../ButtonGroup';
import useConfirmDialog from '../../../components/ConfirmDialog';

const useStyles = makeStyles(theme => ({
  tablePaginationRoot: { float: 'right' },
  fileInput: { display: 'none' },
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
  ssLinkedConnectionId,
  integrationId,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
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

  const handleJobErrorSelectChange = selected => {
    setSelectedErrors(selected);
  };

  return (
    <Fragment>
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
          Completed:{' '}
          <span className={classes.darkGray}>
            <DateTimeDisplay dateTime={job.endedAt} />
          </span>
        </li>
      </ul>
      {!jobErrors ? (
        <div className={classes.spinner}>
          <Spinner size={20} /> <span>Loading errors...</span>
        </div>
      ) : (
        <Fragment>
          <ButtonsGroup className={classes.btnsWrappper}>
            <Button
              data-test="markResolvedJobs"
              variant="outlined"
              color="secondary"
              onClick={handleResolveClick}
              disabled={!hasUnresolvedErrors}>
              {numSelectedResolvableErrors > 0
                ? `Mark resolved ${numSelectedResolvableErrors} errors`
                : 'Mark resolved'}
            </Button>
          </ButtonsGroup>

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
              data={jobErrorsInCurrentPage}
              selectableRows={hasUnresolvedErrorsInCurrentPage}
              isSelectableRow={r => !r.resolved}
              onSelectChange={handleJobErrorSelectChange}
              columns={[
                {
                  heading: 'Message',
                  // eslint-disable-next-line react/display-name
                  value: r => (
                    <JobErrorMessage
                      type={r.type}
                      message={r.message}
                      recordLink={r.recordLink}
                    />
                  ),
                },
                {
                  heading: 'Time',
                  // eslint-disable-next-line react/display-name
                  value: r => <DateTimeDisplay dateTime={r.createdAt} />,
                },
              ]}
            />
          </Fragment>
        </Fragment>
      )}
    </Fragment>
  );
}

export default JobErrorTable;
