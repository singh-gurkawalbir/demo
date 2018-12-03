import { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
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
    dispatch(actions.auth.logout());
  },
});

@withStyles(theme => ({
  bigAvatar: {
    marginLeft: theme.spacing.unit,
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing.unit,
  },
}))
class AppBar extends Component {
  state = {
    anchorEl: null,
  };

  async componentDidMount() {
    const { hasProfile, requestProfile } = this.props;

    if (!hasProfile) {
      requestProfile();
    }
  }

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
    const { anchorEl } = this.state;
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
        <ArrowPopper
          id="profileOptions"
          anchorEl={anchorEl}
          placement="bottom-end"
          open={open}
          onClose={this.handleClose}>
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
            className={classes.button}
            component={Link}
            to="/pg/myAccount/profiles">
            My Account
          </Button>
          <Button
            onClick={handleUserLogout}
            variant="contained"
            size="small"
            color="primary"
            className={classes.button}>
            Sign Out
          </Button>
        </ArrowPopper>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppBar);
