import React from 'react';
import { makeStyles } from '@mui/styles';
import ConnectionsIcon from '../icons/ConnectionsIcon';
import FlowsIcon from '../icons/FlowsIcon';
import IntegrationAppsIcon from '../icons/IntegrationAppsIcon';
import GroupOfUsersIcon from '../icons/GroupOfUsersIcon';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    color: '#107DC1',
    width: 55,
    height: 55,
  },
  message: {
    fontSize: '14px',
  },
});

function DefaultDashboard(props) {
  const classes = useStyles();
  const { integrationId } = props;

  // console.log(integrationId);
  let icon;
  let message;

  switch (integrationId) {
    case 'none':
      icon = <IntegrationAppsIcon className={classes.icon} />;
      message = 'records';
      break;
    case 'connectionGraph':
      icon = <ConnectionsIcon className={classes.icon} />;
      message = 'connections';
      break;
    case 'flowGraph':
      icon = <FlowsIcon className={classes.icon} />;
      message = 'flows';
      break;
    case 'userGraph':
      icon = <GroupOfUsersIcon className={classes.icon} />;
      message = 'users';
      break;
    default:
      icon = null;
      message = 'Default Message';
      break;
  }

  return (
    <div className={classes.root} data-testid={message}>
      {icon && <h1 className={classes.icon}>{icon}</h1>}

      <p className={classes.message}>No {message} added</p>
    </div>
  );
}

export default DefaultDashboard;
