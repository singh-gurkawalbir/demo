import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Divider, ListItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Switch, Route, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import loadable from '../../utils/loadable';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import getRoutePath from '../../utils/routePaths';
import CeligoPageBar from '../../components/CeligoPageBar';

const mapStateToProps = state => {
  const permissions = selectors.userPermissions(state);

  return {
    permissions,
  };
};

const Users = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Users' */ './Users')
);
const Profile = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Profile' */ './Profile')
);
const Subscription = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Users' */ './Subscription')
);
const Audit = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Audit' */ './Audit')
);
const Transfers = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Audit' */ './Transfers/index')
);

@hot(module)
@withStyles(theme => ({
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
    zIndex: 0,
  },
  rightElement: {
    background: theme.palette.background.paper,
    flex: 4,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  activeLink: {
    fontWeight: 'bold',
  },
  flex: {
    flex: 1,
    zIndex: 1,
  },
}))
class MyAccount extends Component {
  render() {
    const { classes, permissions } = this.props;

    return (
      <Fragment>
        <div>
          <CeligoPageBar
            title={
              permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
                ? 'My Account'
                : 'My Profile'
            }
          />
          <Divider />
          <div className={classes.root}>
            <div className={classes.flex}>
              {permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER && (
                <Drawer
                  variant="permanent"
                  anchor="left"
                  classes={{
                    paper: classes.leftElement,
                  }}>
                  <List>
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
                        to="profile">
                        Profile
                      </NavLink>
                    </ListItem>
                    <ListItem>
                      <NavLink
                        activeClassName={classes.activeLink}
                        className={classes.link}
                        to="subscription">
                        Subscription
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
                      <NavLink
                        activeClassName={classes.activeLink}
                        className={classes.link}
                        to="transfers">
                        Transfers
                      </NavLink>
                    </ListItem>
                  </List>
                </Drawer>
              )}
            </div>
            <div className={classes.rightElement}>
              <Switch>
                <Route
                  path={getRoutePath('/myAccount/profile')}
                  component={Profile}
                />
                <Route
                  path={getRoutePath('/myAccount/users')}
                  component={Users}
                />
                <Route
                  path={getRoutePath('/myAccount/subscription')}
                  component={Subscription}
                />
                <Route
                  path={getRoutePath('/myAccount/audit')}
                  component={Audit}
                />
                <Route
                  path={getRoutePath('/myAccount/transfers')}
                  component={Transfers}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(MyAccount);
