import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';
import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import JobDetail from './JobDetail';
import actions from '../../../../actions';
import Spinner from '../../../Spinner';
import { selectors } from '../../../../reducers';
import ErrorsListDrawer from '../../../../views/Integration/common/ErrorsList';
import RunHistoryDrawer from '../../RunHistoryDrawer';

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
  tableContainer: {
    overflowX: 'auto',
  },
}));

export default function JobTable({
  jobsInCurrentPage,
  userPermissionsOnIntegration,
}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const [openedJobErrors, setOpenedJobErrors] = useState(false);
  const [showErrorDialogFor] = useState({});
  const isRunningJobsCollectionLoading = useSelector(state => selectors.isRunningJobsCollectionLoading(state));

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const _JobId = queryParams.get('_jobId');
  const flowJobId = queryParams.get('_flowJobId');

  const handleViewErrorsClick = useCallback(({
    flowId,
  }) => {
    history.push(`${match.url}/${flowId}/errorsList`);
  }, [history, match.url]);

  const handleRunHistoryClick = useCallback(({
    flowId,
  }) => {
    history.push(`${match.url}/${flowId}/runHistory`);
  }, [history, match.url]);

  useEffect(() => {
    if (!openedJobErrors && flowJobId) {
      dispatch(actions.job.requestFamily({ jobId: flowJobId }));
      handleViewErrorsClick({jobId: _JobId, parentJobId: flowJobId, includeAll: true});
      setOpenedJobErrors(true);
    }
  }, [_JobId, dispatch, flowJobId, handleViewErrorsClick, openedJobErrors, history, showErrorDialogFor]);

  return (
    <>
      {isRunningJobsCollectionLoading ? (

        <Spinner centerAll />

      ) : (
        <div className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.name}>Integration</TableCell>
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
            <TableBody data-test="Dashboard">
              {jobsInCurrentPage.map(job => (
                <JobDetail
                  key={job._id}
                  job={job}
                  userPermissionsOnIntegration={userPermissionsOnIntegration}
                  onViewErrorsClick={handleRunHistoryClick}
            />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ErrorsListDrawer integrationId="59670d677ba2c865d9fced57" />
      <RunHistoryDrawer />
    </>
  );
}

