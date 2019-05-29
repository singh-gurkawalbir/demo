import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { Divider, ListItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Switch, Route, NavLink } from 'react-router-dom';
import loadable from '../../utils/loadable';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import { STANDALONE_INTEGRATION } from '../../utils/constants';

const mapStateToProps = (state, { match }) => {
  const { integrationId } = match.params;
  let integration;

  if (integrationId === STANDALONE_INTEGRATION.id) {
    integration = {
      _id: STANDALONE_INTEGRATION.id,
      name: STANDALONE_INTEGRATION.name,
    };
  } else {
    integration = selectors.resource(state, 'integrations', integrationId);
  }

  return {
    integration,
  };
};

const Flows = loadable(() =>
  import(/* webpackChunkName: 'IntegrationSettings.Flows' */ './Flows')
);
const Users = loadable(() =>
  import(/* webpackChunkName: 'IntegrationSettings.Users' */ './Users')
);
const AuditLog = loadable(() =>
  import(/* webpackChunkName: 'IntegrationSettings.AuditLog' */ './AuditLog')
);

@hot(module)
@withStyles(theme => ({
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  appFrame: {
    padding: theme.spacing.unit,
  },
  about: {
    padding: theme.spacing.unit,
  },
  root: {
    display: 'flex',
    padding: theme.spacing.unit,
    alignItems: 'flex-start',
  },
  leftElement: {
    position: 'relative',
    textAlign: 'center',
    padding: theme.spacing.unit,
    minHeight: 500,
  },
  rightElement: {
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing.unit,
  },
  activeLink: {
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
  },
}))
class IntegrationSettings extends Component {
  render() {
    const { classes, integration } = this.props;

    return (
      <LoadResources resources={['integrations']} required>
        <Fragment>
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
                </Switch>
              </div>
            </div>
          </div>
        </Fragment>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(IntegrationSettings);
