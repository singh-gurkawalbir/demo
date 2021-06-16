import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import JobDashboard from '../../../../components/JobDashboard/AccountDashboard/CompletedFlows';
import LoadResources from '../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    overflow: 'auto',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function DashboardPanel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LoadResources required resources="flows">

        <JobDashboard integrationId="59670d677ba2c865d9fced57" />
      </LoadResources>
    </div>
  );
}
