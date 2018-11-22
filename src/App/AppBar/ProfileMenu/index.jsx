import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { connect } from 'react-redux';
import actions from '../../../actions';
import { logoutParams } from '../../../utils/api';
import {
  isProfileDataReady,
  hasProfile,
  userProfile,
  avatarUrl,
  themeName,
} from '../../../reducers';

const mapStateToProps = state => ({
  hasProfile: hasProfile(state),
  isProfileDataReady: isProfileDataReady(state),
  profile: userProfile(state),
  avatarUrl: avatarUrl(state),
  themeName: themeName(state),
});
const mapDispatchToProps = dispatch => ({
  onSetTheme: themeName => {
    dispatch(actions.setTheme(themeName));
  },
  requestProfile: () => {
    dispatch(actions.profile.request());
  },
  handleUserLogout: () => {
    dispatch(actions.auth.logout(logoutParams.path, logoutParams.opts));
  },
});

@withStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  playground: {
    textDecoration: 'none',
    color: 'white',
    flex: 1,
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
class AppBar extends Component {
  state = {
    anchorEl: null,
    arrowEl: null,
  };

  async componentDidMount() {
    const { hasProfile, requestProfile } = this.props;

    if (!hasProfile) {
      requestProfile();
    }
  }

  handlearrowEl = node => {
    this.setState({ arrowEl: node });
  };

  handleMenu = event => {
    if (this.state.anchorEl) {
      this.setState({ anchorEl: null });
    } else {
      this.setState({ anchorEl: event.currentTarget });
    }
  };
  handleThemeChange = event => {
    this.props.onSetTheme(event.target.value);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl, arrowEl } = this.state;
    const open = Boolean(anchorEl);
    const {
      classes,
      profile,
      themeName,
      avatarUrl,
      isProfileDataReady,
      handleUserLogout,
    } = this.props;

    if (!isProfileDataReady) {
      return null;
    }

    return (
      <div>
        <IconButton
          aria-owns={open ? 'profileOptions' : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit">
          <Avatar
            alt={profile.name}
            src={avatarUrl}
            className={classes.avatar}
          />
        </IconButton>
        <Popper
          id="profileOptions"
          anchorEl={anchorEl}
          placement="bottom-end"
          open={open}
          className={classes.popper}
          onClose={this.handleClose}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
            arrow: {
              enabled: true,
              element: arrowEl,
            },
          }}>
          <span className={classes.arrow} ref={this.handlearrowEl} />
          <ClickAwayListener onClickAway={this.handleClose}>
            <Paper className={classes.profileMenu}>
              <Grid
                container
                spacing={16}
                direction="row"
                justify="flex-start"
                alignItems="flex-start">
                <Grid item>
                  <Avatar
                    alt={profile.name}
                    src={avatarUrl}
                    className={classes.bigAvatar}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h5">{profile.name}</Typography>
                  <Typography variant="h6">{profile.email}</Typography>
                </Grid>
              </Grid>
              <div>
                <FormControl className={classes.formControl}>
                  <Select
                    native
                    value={themeName}
                    onChange={this.handleThemeChange}
                    inputProps={{ name: 'themeName' }}>
                    <option value="light">Celigo Light Theme</option>
                    <option value="dark">Celigo Dark Theme</option>
                  </Select>
                </FormControl>
              </div>
              <Button
                onClick={this.handleClose}
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}>
                My Profile
              </Button>
              <Button
                onClick={handleUserLogout}
                variant="contained"
                size="small"
                color="primary"
                className={classes.button}>
                Sign Out
              </Button>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar);
