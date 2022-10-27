import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import Status from '../../../components/Buttons/Status';
import Spinner from '../../../components/Spinner';
import actions from '../../../actions';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import TextButton from '../../../components/Buttons/TextButton';
import { isNewId } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  statusAppBlock: {
    display: 'flex',
    justifyContent: 'center',
    '& > button': {
      fontSize: 14,
    },
  },
  spinner: {
    marginRight: theme.spacing(0.5),
    display: 'flex',
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
  },
  retryContainer: {
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
  },
  retryCompleteButton: {
    width: theme.spacing(8),
    padding: 0,
    textAlign: 'left',
    lineHeight: 1,
  },
}));

export default function ErrorStatus({ count, isNew, flowId, resourceId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const shouldErrorStatusBeShown = useSelector(state => {
    const isUserInErrMgtTwoDotZero = selectors.isOwnerUserInErrMgtTwoDotZero(state);
    const latestFlowJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return !isNew && isUserInErrMgtTwoDotZero && latestFlowJobs.length;
  });
  const retryStatus = useSelector(
    state => selectors.retryStatus(state, flowId, resourceId)
  );

  const handleStatus = useCallback(
    errorType => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
        baseUrl: match.url,
        params: { resourceId, errorType},
      }));
    },
    [history, match.url, resourceId],
  );

  /**
   * Fetches the retries status to display on the resource node
   * clears the errorDetails, retryStatus and respective tab filters on unmount
  */
  useEffect(() => {
    if (flowId && resourceId && !isNewId(flowId)) {
      dispatch(actions.errorManager.retryStatus.requestPoll({ flowId, resourceId}));
    }

    return () => {
      dispatch(actions.errorManager.retryStatus.stopPoll());
      dispatch(actions.errorManager.flowErrorDetails.clear({ flowId, resourceId }));
      dispatch(actions.errorManager.retries.clear({flowId, resourceId}));
      dispatch(actions.clearFilter(FILTER_KEYS.OPEN));
      dispatch(actions.clearFilter(FILTER_KEYS.RESOLVED));
      dispatch(actions.clearFilter(FILTER_KEYS.RETRIES));
    };
  }, [dispatch, flowId, resourceId]);

  /**
   * Error status ( error / success ) is shown only if the user is in EM 2.0
   * If the flow has been run at least once (has at least one flow job)
   */
  if (!shouldErrorStatusBeShown) {
    return null;
  }

  return (
    <div className={classes.statusAppBlock}>
      <Status
        onClick={() => handleStatus('open')}
        variant={count ? 'error' : 'success'}> { count ? `${count} errors` : 'Success'}
      </Status>
      { retryStatus === 'inProgress' && (
      <div className={classes.retryContainer}>
        <Divider orientation="vertical" className={classes.divider} />
        <Spinner size={16} className={classes.spinner} />
        <Typography variant="caption" component="div" >
          Retrying
        </Typography>
      </div>
      )}
      { retryStatus === 'completed' && (
        <div className={classes.retryContainer}>
          <Divider orientation="vertical" className={classes.divider} />
          <TextButton size="small" color="primary" className={classes.retryCompleteButton} onClick={() => handleStatus(FILTER_KEYS.RETRIES)}>
            Retry completed
          </TextButton>
        </div>
      )}
    </div>
  );
}

