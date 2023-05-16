import React from 'react';
import { makeStyles } from '@mui/styles';
import ConnectionsIcon from '../../../../../components/icons/ConnectionsIcon';
import FlowsIcon from '../../../../../components/icons/FlowsIcon';
import IntegrationAppsIcon from '../../../../../components/icons/IntegrationAppsIcon';
import InviteUsersIcon from '../../../../../components/icons/InviteUsersIcon';

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
  const { id } = props;

  let icon;
  let message;

  // Determine the icon and message based on the ID
  switch (id) {
    case '0':
      icon = <ConnectionsIcon className={classes.icon} />;
      message = 'connections';
      break;
    case '1':
      icon = <ConnectionsIcon className={classes.icon} />;
      message = 'connections';
      break;
    case '2':
      icon = <InviteUsersIcon className={classes.icon} />;
      message = 'users';
      break;
    case '3':
      icon = <FlowsIcon className={classes.icon} />;
      message = 'flows';
      break;
    case '4':
      icon = <IntegrationAppsIcon className={classes.icon} />;
      message = 'records';
      break;
    default:
      icon = null;
      message = 'Default Message';
      break;
  }

  return (
    <div className={classes.root}>
      {icon && <h1 className={classes.icon}>{icon}</h1>}

      <p className={classes.message}>No {message} added</p>
    </div>
  );
}

export default DefaultDashboard;
