import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Divider, Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import Spinner from '../../../components/Spinner';
import { useSelectorMemo } from '../../../hooks';
import { emptyObject } from '../../../constants';
import { RETRY_JOB_UI_STATUS } from '../../../utils/jobdashboard';
import TextButton from '../../../components/Buttons/TextButton';
import { FILTER_KEYS } from '../../../utils/errorManagement';
import RetryListPopper from './RetryListPopper';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  spinner: {
    marginRight: theme.spacing(0.5),
    display: 'flex',
  },
  viewResultButton: {
    padding: theme.spacing(0, 0.5),
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
  },
}));

export default function RetryStatus({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();

  const {isAnyRetryInProgress, resourcesWithRetryCompleted} = useSelectorMemo(selectors.mkFlowResourcesRetryStatus, flowId) || emptyObject;

  const handleClick = useCallback(
    () => {
      history.push(buildDrawerUrl({
        path: drawerPaths.ERROR_MANAGEMENT.V2.ERROR_DETAILS,
        baseUrl: match.url,
        params: { resourceId: resourcesWithRetryCompleted[0]?._id, errorType: FILTER_KEYS.RETRIES},
      }));
    },
    [history, match.url, resourcesWithRetryCompleted],
  );

  const retriesStatusLabel = useMemo(() => {
    if (isAnyRetryInProgress) {
      return (
        <>
          <Spinner size={16} className={classes.spinner} />
          <span>{RETRY_JOB_UI_STATUS.running}</span>
        </>
      );
    }

    return (
      <>
        <Typography variant="caption" component="div" className={classes.status}>
          Retry completed.
        </Typography>
        {resourcesWithRetryCompleted.length > 1 ? (
          <RetryListPopper resources={resourcesWithRetryCompleted} />
        ) : (
          <TextButton size="small" color="primary" className={classes.viewResultButton} onClick={handleClick}>
            View results
          </TextButton>
        )}
      </>
    );
  }, [isAnyRetryInProgress, classes.status, classes.icon, resourcesWithRetryCompleted, handleClick]);

  if (!isAnyRetryInProgress && !resourcesWithRetryCompleted.length) {
    return null;
  }

  return (
    <>
      <Divider orientation="vertical" className={classes.divider} />
      <span className={classes.flexContainer}>
        {retriesStatusLabel}
      </span>
    </>
  );
}
