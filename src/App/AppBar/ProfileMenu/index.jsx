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
import LoadResources from '../../../components/LoadResources';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const mapStateToProps = state => ({
  hasProfile: selectors.hasProfile(state),
  isProfileDataReady: selectors.isProfileDataReady(state),
  profile: selectors.userProfile(state),
  preferences: selectors.userPreferences(state),
  avatarUrl: selectors.avatarUrl(state),
});
const mapDispatchToProps = dispatch => ({
  requestProfile: () => {
    dispatch(actions.profile.request());
  },
  requestPreferences: () => {
    dispatch(actions.profile.requestPreferences());
  },
  handleUserLogout: () => {
    dispatch(actions.auth.logout());
  },
  updateThemeNameInPreferences: themeName => {
    dispatch(actions.profile.updatePreferences({ themeName }));
  },
});

@withStyles(theme => ({
  avatarButton: {
    padding: theme.spacing.unit,
  },
  avatar: {
    width: theme.spacing.quad,
    height: theme.spacing.quad,
  },
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
    const themeName = event.target.value;

    this.props.updateThemeNameInPreferences(themeName);
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
      avatarUrl,
      isProfileDataReady,
      handleUserLogout,
      preferences,
    } = this.props;
    const { themeName } = preferences;

    if (!isProfileDataReady) {
      return null;
    }

    return (
      <LoadResources resources={['preferences']}>
        <IconButton
          className={classes.avatarButton}
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
      </LoadResources>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(AppBar);
