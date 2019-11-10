import Drawer from '@material-ui/core/Drawer';
import { useSelector } from 'react-redux';
import { Divider, ListItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Switch, Route, NavLink, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import Flows from './Flows';
import Users from './Users';
import AuditLog from './AuditLog';
import Connections from './Connections';
import Notifications from './Notifications';
import General from './General';
import CeligoPageBar from '../../components/CeligoPageBar';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
  },
  root: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(1),
    minHeight: 500,
    zIndex: 0,
  },
  rightElement: {
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  activeLink: {
    fontWeight: 'bold',
  },
  notificationLink: {
    margin: '25px 0 25px 0',
  },
  flex: {
    flex: 1,
  },
}));

export default function IntegrationSettings(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  let integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );

  if (integrationId === STANDALONE_INTEGRATION.id) {
    integration = {
      _id: STANDALONE_INTEGRATION.id,
      name: STANDALONE_INTEGRATION.name,
    };
  }

  if (!integration) {
    return null;
  }

  return (
    <LoadResources required resources="integrations">
      <div>
        <CeligoPageBar title={integration.name}>
          <Link
            to={getRoutePath(`integrations/${integrationId}/dashboard`)}
            className={classes.dashboard}>
            Dashboard
          </Link>
        </CeligoPageBar>
        <Divider />
        <div className={classes.root}>
          <div className={classes.flex}>
            <Drawer
              variant="permanent"
              anchor="left"
              classes={{
                paper: classes.leftElement,
              }}>
              <List>
                {integration._id !== STANDALONE_INTEGRATION.id && (
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="general">
                      General
                    </NavLink>
                  </ListItem>
                )}
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="flows">
                    Integration Flows
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="connections">
                    Connections
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="users">
                    Users
                  </NavLink>
                </ListItem>
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="audit">
                    Audit Log
                  </NavLink>
                </ListItem>
                <ListItem>
                  {integration._id !== STANDALONE_INTEGRATION.id && (
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="delete">
                      Delete
                    </NavLink>
                  )}
                </ListItem>
                <Divider className={classes.notificationLink} />
                <ListItem>
                  <NavLink
                    activeClassName={classes.activeLink}
                    className={classes.link}
                    to="notifications">
                    My Notifications
                  </NavLink>
                </ListItem>
              </List>
            </Drawer>
          </div>
          <div className={classes.rightElement}>
            <Switch>
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/flows`
                )}
                component={Flows}
              />
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/connections`
                )}
                component={Connections}
              />
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/users`
                )}
                component={Users}
              />
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/audit`
                )}
                component={AuditLog}
              />
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/general`
                )}
                component={General}
              />
              <Route
                path={getRoutePath(
                  `/integrations/:integrationId/settings/notifications`
                )}
                component={Notifications}
              />
            </Switch>
          </div>
        </div>
      </div>
    </LoadResources>
  );
}
