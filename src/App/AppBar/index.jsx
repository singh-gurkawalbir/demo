import { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
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
  appBar: {
    backgroundColor: theme.appBarBackground,
  },
  flex: {
    flex: 1,
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
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <IconButton
              onClick={onToggleDrawer}
              className={classes.menuButton}
              aria-label="Menu">
              <MenuIcon className={classes.icon} />
            </IconButton>

            <div className={classes.flex}>
              <Link
                className={classNames(classes.celigoLogo, classes.playground)}
                to="/pg/"
              />
            </div>
            {authenticated && <ProfileMenu />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(Appbar);
