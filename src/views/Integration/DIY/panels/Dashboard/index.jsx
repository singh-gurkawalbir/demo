import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import IntegrationDashboard from '../../../../Dashboard';
import JobDashboard from '../../../../../components/JobDashboard';
import LoadResources from '../../../../../components/LoadResources';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel({ integrationId, childId }) {
  const classes = useStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">
        {isUserInErrMgtTwoDotZero
          ? <IntegrationDashboard integrationId={childId || integrationId} />
          : <JobDashboard integrationId={childId || integrationId} />}
      </LoadResources>
    </div>
  );
}
