import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import { Divider, ListItem } from '@material-ui/core';
import List from '@material-ui/core/List';
import { Switch, Route, NavLink } from 'react-router-dom';
import loadable from '../../utils/loadable';

const Users = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Users' */ './Users')
);
const Profiles = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Profiles' */ './Profiles')
);
const Subscription = loadable(() =>
  import(/* webpackChunkName: 'MyAccount.Users' */ './Subscription')
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
export default class MyAccount extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.appFrame}>
          <div className={classes.about}>
            <Typography variant="h5">My Account</Typography>
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
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="/pg/myAccount/users">
                      Users
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="/pg/myAccount/profiles">
                      Profiles
                    </NavLink>
                  </ListItem>
                  <ListItem>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to="/pg/myAccount/subscription">
                      Subscription
                    </NavLink>
                  </ListItem>
                </List>
              </Drawer>
            </div>
            <div className={classes.rightElement}>
              <Switch>
                <Route path="/pg/myAccount/profiles" component={Profiles} />
                <Route path="/pg/myAccount/users" component={Users} />
                <Route
                  path="/pg/myAccount/subscription"
                  component={Subscription}
                />
              </Switch>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
