import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, ListItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Switch, Route, NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import { STANDALONE_INTEGRATION } from '../../utils/constants';
import Flows from './Flows';
import Users from './Users';
import AuditLog from './AuditLog';
import AccessTokens from './AccessTokens';
import Connections from './Connections';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  appFrame: {
    padding: theme.spacing(1),
  },
  about: {
    padding: theme.spacing(1),
  },
  root: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'flex-start',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing(1),
    minHeight: 500,
  },
  rightElement: {
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  activeLink: {
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
  },
}));

export default function IntegrationSettings(props) {
  const classes = useStyles();
  const { integrationId } = props.match.params;
  const dispatch = useDispatch();
  const integration = useSelector(state => {
    if (integrationId === STANDALONE_INTEGRATION.id) {
      return {
        _id: STANDALONE_INTEGRATION.id,
        name: STANDALONE_INTEGRATION.name,
      };
    }

    return selectors.resource(state, 'integrations', integrationId);
  });

  useEffect(() => {
    if (!integration) {
      dispatch(actions.resource.request('integrations', integrationId));
    }
  });

  if (!integration) {
    return null;
  }

  return (
    <LoadResources required resources="integrations">
      <div className={classes.appFrame}>
        <div className={classes.about}>
          <Typography variant="h5">{integration.name}</Typography>
        </div>
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
                  `/integrations/:integrationId/settings/tokens`
                )}
                component={AccessTokens}
              />
            </Switch>
          </div>
        </div>
      </div>
    </LoadResources>
  );
}
