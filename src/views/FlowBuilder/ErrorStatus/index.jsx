import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../reducers';
import Status from '../../../components/Buttons/Status';

const useStyles = makeStyles(theme => ({
  statusAppBlock: {
    marginTop: theme.spacing(1),
    fontSize: 14,
  },
}));

export default function ErrorStatus({ count, isNew, flowId, resourceId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const shouldErrorStatusBeShown = useSelector(state => {
    const isUserInErrMgtTwoDotZero = selectors.isOwnerUserInErrMgtTwoDotZero(state);
    const latestFlowJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return !isNew && isUserInErrMgtTwoDotZero && latestFlowJobs.length;
  });

  const handleStatus = useCallback(
    () => {
      history.push(`${match.url}/errors/${resourceId}`);
    },
    [history, match.url, resourceId],
  );

  /**
   * Error status ( error / success ) is shown only if the user is in EM 2.0
   * If the flow has been run at least once (has at least one flow job)
   */
  if (!shouldErrorStatusBeShown) {
    return null;
  }

  return (
    <Status fullWidth className={classes.statusAppBlock} onClick={handleStatus} variant={count ? 'error' : 'success'}> { count ? `${count} errors` : 'Success'}</Status>
  );
}

