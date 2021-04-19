import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from '@material-ui/core';
import { difference } from 'lodash';
import { JOB_STATUS } from '../../utils/constants';
import JobDetail from './JobDetail';
import ErrorDrawer from './ErrorDrawer';
import actions from '../../actions';
import Spinner from '../Spinner';
import { selectors } from '../../reducers';

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
    position: 'relative',
  },
  checkFlow: {
    paddingLeft: 40,
  },
  name: {
    width: '18.15%',
    wordBreak: 'break-word',
    [theme.breakpoints.down('md')]: {
      wordBreak: 'normal',
    },
  },
  status: {
    width: '10.15%',
  },
  success: {
    width: '9%',
    textAlign: 'right',
  },
  ignore: {
    width: '7.5%',
    textAlign: 'right',
  },
  error: {
    width: '10.15%',
    textAlign: 'right',
  },
  resolved: {
    width: '9%',
    textAlign: 'right',
  },
  pages: {
    width: '7.5%',
    textAlign: 'right',
  },
  duration: {
    width: '9%',
    textAlign: 'right',
  },
  completed: {
    width: '11.5%',
    whiteSpace: 'no-wrap',
  },
  actions: {
    width: '7.5%',
    textAlign: 'center',
  },
}));

export default function JobTable({
  onSelectChange,
  jobsInCurrentPage,
  selectedJobs,
  userPermissionsOnIntegration,
  integrationName,
  isFlowBuilderView,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const [openedJobErrors, setOpenedJobErrors] = useState(false);
  const [showErrorDialogFor, setShowErrorDialogFor] = useState({});
  const isFlowJobsCollectionLoading = useSelector(state => selectors.isFlowJobsCollectionLoading(state));
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
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _JobId = queryParams.get('_jobId');
  const flowJobId = queryParams.get('_flowJobId');
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
      job.flowDisabled = selectableJobsInCurrentPage.find(j => j._id === jobId)?.flowDisabled;

      if (!checked) {
        job.selectedChildJobIds = [];
      }

      jobIds[jobId] = job;
    });
    onSelectChange(jobIds);
  }

  const handleViewErrorsClick = useCallback(({
    jobId,
    parentJobId,
    showResolved = false,
    numError,
    includeAll,
    numResolved,
  }) => {
    setShowErrorDialogFor({
      jobId,
      parentJobId,
      showResolved,
      numError,
      includeAll,
      numResolved,
    });

    history.push(`${match.url}/viewErrors`);
  }, [history, match.url]);

  useEffect(() => {
    if (!openedJobErrors && flowJobId) {
      dispatch(actions.job.requestFamily({ jobId: flowJobId }));
      handleViewErrorsClick({jobId: _JobId, parentJobId: flowJobId, includeAll: true});
      setOpenedJobErrors(true);
    }
    // This logic is to handle the case when user tries to reload the page with viewErrors link
    // ViewErrors drawer will work when user selects a job error or from the error notification mail
    // For reload case as there is no track of jobID, redirecting to the job table dashboard
    if (history.location.pathname.includes('/viewErrors') && !(_JobId || showErrorDialogFor?.jobId)) {
      const urlExtractFields = history.location.pathname.split('/');
      const indexToBeStripped = urlExtractFields.length - urlExtractFields.indexOf('viewErrors');
      const strippedRoute = urlExtractFields.slice(0, -indexToBeStripped).join('/');

      history.replace(strippedRoute);
    }
  }, [_JobId, dispatch, flowJobId, handleViewErrorsClick, openedJobErrors, history, showErrorDialogFor]);

  function handleErrorDrawerClose() {
    history.goBack();
    // only clear the current error set if the close was fired from
    // this drawer and not the child retry drawer.
    // if (match.isExact) setShowErrorDialogFor({});
    /** Dirty fix, I don't see a better option. */
    // TODO: Need to come up with proper fix to remount ErrorDrawer
    // Updated with patch fix @IO-20793
    if (history?.location?.pathname?.endsWith('/viewErrors')) {
      setShowErrorDialogFor({});
    }
  }

  return (
    <>
      {isFlowJobsCollectionLoading ? (

        <Spinner centerAll />

      ) : (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.checkFlow}>
                <Checkbox
                  disabled={jobsInCurrentPage.length === 0}
                  checked={isSelectAllChecked}
                  onChange={handleSelectAllChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'Select all jobs' }}
              />
              </TableCell>
              <TableCell className={classes.name}>Flow</TableCell>
              <TableCell className={classes.status}>Status</TableCell>
              <TableCell className={classes.success}>Success</TableCell>
              <TableCell className={classes.ignore}>Ignored</TableCell>
              <TableCell className={classes.error}>Errors</TableCell>
              <TableCell className={classes.resolved}>Resolved</TableCell>
              <TableCell className={classes.pages}>Pages</TableCell>
              <TableCell className={classes.duration}>Duration</TableCell>
              <TableCell className={classes.completed}>Completed</TableCell>
              <TableCell className={classes.actions}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-test={`${integrationName}Dashboard`}>
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
      )}
      {(showErrorDialogFor?.jobId || _JobId) && (
      <ErrorDrawer
        // for now, force tall (default)
        // height={isFlowBuilderView ? 'short' : 'tall'}
        integrationName={integrationName}
        jobId={showErrorDialogFor.jobId}
        includeAll={showErrorDialogFor.includeAll}
        parentJobId={showErrorDialogFor.parentJobId}
        showResolved={showErrorDialogFor.showResolved}
        numError={showErrorDialogFor.numError}
        numResolved={showErrorDialogFor.numResolved}
        onClose={handleErrorDrawerClose}
        />
      )}
    </>
  );
}
