import { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import * as selectors from '../../reducers';
import WaffleBox from './WaffleBox';
import AccountList from './AccountList';
import Notifications from './Notifications';
import LicenseAction from './LicenseAction';

const mapStateToProps = state => ({
  authenticated: selectors.isAuthenticated(state),
});

@withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: theme.appBar.background,
  },
  toolbar: {
    height: 55,
    minHeight: 55,
  },
  logoContainer: {
    flex: '1 1 1',
  },
  navLinksContainer: {
    paddingLeft: theme.spacing.unit * 3,
    flex: 1,
  },
  // TODO: This does nothing...
  // figure out how to affect child elements under container
  iconContainer: {
    '&button': {
      padding: theme.spacing.unit - 1,
      margin: theme.spacing.unit / 2,
    },
  },
  celigoLogo: {
    float: 'left',
    position: 'static',
    height: 55,
    width: 140,
    // marginLeft: theme.spacing.unit * 2,
    background: `url(${
      process.env.CDN_BASE_URI
    }flow-builder/celigo-product-logo.svg) no-repeat center left`,
  },
  navLink: {
    color: theme.appBar.contrast,
    paddingRight: theme.spacing.unit * 3,
    letterSpacing: '1.3px',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    textTransform: 'uppercase',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))
export class Appbar extends Component {
  render() {
    const { classes, authenticated } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar className={classes.toolbar}>
            <div className={classes.logoContainer}>
              <Link className={classNames(classes.celigoLogo)} to="/pg/" />
            </div>
            <div className={classes.navLinksContainer}>
              <Link className={classes.navLink} to="/pg/">
                Home
              </Link>
              <Link className={classes.navLink} to="/pg/editors">
                Editors
              </Link>
              <Link className={classes.navLink} to="/pg/resources">
                Resources
              </Link>
              <Link className={classes.navLink} to="/pg/permissions">
                Permissions
              </Link>
            </div>
            <LicenseAction />
            <div className={classes.iconContainer}>
              <AccountList />
              <Notifications />
              <WaffleBox />
              {authenticated && <ProfileMenu />}
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
// prettier-ignore
export default connect(mapStateToProps, null)(Appbar);
