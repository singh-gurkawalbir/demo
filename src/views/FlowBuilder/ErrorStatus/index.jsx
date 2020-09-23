import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import StatusCircle from '../../../components/StatusCircle';
import Status from '../../../components/Status';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  status: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    '& span': {
      fontSize: '12px',
    },
  },
}));

export default function ErrorStatus({ count, isNew, handleStatusClick, flowId }) {
  const classes = useStyles();
  const shouldErrorStatusBeShown = useSelector(state => {
    const isUserInErrMgtTwoDotZero = selectors.isOwnerUserInErrMgtTwoDotZero(state);
    const latestFlowJobs = selectors.latestFlowJobsList(state, flowId)?.data || [];

    return !isNew && isUserInErrMgtTwoDotZero && latestFlowJobs.length;
  });

  /**
   * Error status ( error / success ) is shown only if the user is in EM 2.0
   * If the flow has been run at least once (has at least one flow job)
   */
  if (!shouldErrorStatusBeShown) {
    return null;
  }

  if (count) {
    return (
      <Status
        className={classes.status}
        onClick={handleStatusClick}
        label={`${count} errors`}>
        <StatusCircle variant="error" size="small" />
      </Status>
    );
  }

  return (
    <Status
      className={classes.status}
      onClick={handleStatusClick}
      label="Success">
      <StatusCircle variant="success" size="small" />
    </Status>
  );
}

