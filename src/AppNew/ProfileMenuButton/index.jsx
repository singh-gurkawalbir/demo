import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { A } from 'hookrouter';
import ArrowPopper from '../../components/ArrowPopper';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { USER_ACCESS_LEVELS } from '../../utils/constants';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  popperContent: {
    padding: theme.spacing(1),
    zIndex: theme.zIndex.drawer + 1,
  },

  avatarButton: {
    padding: theme.spacing(1),
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  bigAvatar: {
    marginLeft: theme.spacing(1),
    width: 60,
    height: 60,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ProfileMenuButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const hasProfile = useSelector(state => selectors.hasProfile(state));
  const hasPreferences = useSelector(state => selectors.hasPreferences(state));
  const profile = useSelector(state => selectors.userProfile(state)) || {};
  const avatarUrl = useSelector(state => selectors.avatarUrl(state));
  const permissions = useSelector(state => selectors.userPermissions(state));
  const dispatch = useDispatch();
  const open = !!anchorEl;
  const { name, email } = profile;
  const handleUserLogout = () => {
    dispatch(actions.auth.logout());
  };

  const handleMenu = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!hasProfile || !hasPreferences) return null;

  return (
    <Fragment>
      <IconButton
        className={classes.avatarButton}
        aria-owns={open ? 'profileOptions' : null}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit">
        <Avatar alt={name} src={avatarUrl} className={classes.avatar} />
      </IconButton>
      <ArrowPopper
        zIndex="1201"
        id="profileOptions"
        className={classes.popperContent}
        anchorEl={anchorEl}
        placement="bottom-end"
        open={open}
        onClose={handleClose}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start">
          <Grid item>
            <Avatar alt={name} src={avatarUrl} className={classes.bigAvatar} />
          </Grid>
          <Grid item>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h5">{email}</Typography>
          </Grid>
        </Grid>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          className={classes.button}
          component={A}
          href={getRoutePath(
            permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
              ? '/myAccount/subscription'
              : '/myAccount/profiles'
          )}>
          {permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
            ? 'My Account'
            : 'My Profile'}
        </Button>
        <Button
          onClick={handleUserLogout}
          variant="contained"
          color="primary"
          className={classes.button}>
          Sign Out
        </Button>
      </ArrowPopper>
    </Fragment>
  );
}
