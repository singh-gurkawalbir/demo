import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { difference } from 'lodash';
import clsx from 'clsx';
import { Spinner } from '@celigo/fuse-ui';
import { JOB_STATUS } from '../../constants';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';
import JobDetail from './JobDetail';
import ErrorDrawer from './ErrorDrawer';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { JobDetailsStyles } from './ChildJobDetail';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
    position: 'relative',
  },
  checkFlow: {
    paddingLeft: 40,
  },
  name: {
    wordBreak: 'break-word',
    [theme.breakpoints.down('lg')]: {
      wordBreak: 'normal',
    },
  },
  error: {
    textAlign: 'right',
  },
  tableContainer: {
    overflowX: 'auto',
    overflowY: 'hidden',
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
  const classes = JobDetailsStyles();
  const jobDetailsClasses = useStyles();
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

    history.push(buildDrawerUrl({
      path: drawerPaths.ERROR_MANAGEMENT.V1.VIEW_JOB_ERRORS,
      baseUrl: match.url,
    }));
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
      // TODO: @RAGHU, Do we need this logic?
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
        <Spinner center="horizontal" size="large" />
      ) : (
        <div className={classes.tableContainer}>
          <Table className={clsx(classes.table, jobDetailsClasses.table)}>
            <TableHead>
              <TableRow>
                <TableCell className={clsx(classes.checkFlow, jobDetailsClasses.checkFlow)}>
                  <Checkbox
                    disabled={jobsInCurrentPage.length === 0}
                    checked={isSelectAllChecked}
                    onChange={handleSelectAllChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'Select all jobs' }}
              />
                </TableCell>
                <TableCell className={clsx(classes.name, jobDetailsClasses.name)}>Flow</TableCell>
                <TableCell className={classes.status}>Status</TableCell>
                <TableCell className={classes.success}>Success</TableCell>
                <TableCell className={classes.ignore}>Ignored</TableCell>
                <TableCell className={clsx(classes.error, jobDetailsClasses.error)}>Errors</TableCell>
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
        </div>
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
