import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { isAuthenticated } from '../../reducers';

const mapStateToProps = state => ({
  authenticated: isAuthenticated(state),
});

@withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  celigoLogo: {
    width: 120,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  playground: {
    textDecoration: 'none',
    color: 'white',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  icon: {
    fill: theme.palette.light,
  },
  bigAvatar: {
    marginLeft: theme.spacing.unit,
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing.unit,
  },
  profileMenu: {
    padding: theme.spacing.unit,
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  popper: {
    zIndex: 1,
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.9em',
      width: '3em',
      height: '1em',
      '&::before': {
        borderWidth: '0 1em 1em 1em',
        borderColor: `transparent transparent ${
          theme.palette.background.paper
        } transparent`,
      },
    },
  },
}))
export class Appbar extends Component {
  state = {
    anchorEl: null,
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, onToggleDrawer, authenticated } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            {authenticated && (
              <Fragment>
                <IconButton
                  onClick={onToggleDrawer}
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="Menu">
                  <MenuIcon className={classes.icon} />
                </IconButton>

                <Link className={classes.playground} to="/pg/">
                  <Typography
                    variant="h6"
                    color="inherit"
                    className={classes.flex}>
                    integrator.io
                  </Typography>
                </Link>
              </Fragment>
            )}
            <img
              src="https://www.celigo.com/wp-content/uploads/celigo-logo-white.svg"
              srcSet="https://www.celigo.com/wp-content/uploads/celigo-logo-white.svg 1x"
              alt="Celigo Logo"
              className={classes.celigoLogo}
            />
            {authenticated && <ProfileMenu />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Appbar);
