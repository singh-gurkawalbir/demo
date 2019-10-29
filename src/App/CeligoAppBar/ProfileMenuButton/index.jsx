import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { USER_ACCESS_LEVELS } from '../../../utils/constants';
import getRoutePath from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  popperContent: {
    padding: 12,
    zIndex: theme.zIndex.drawer + 1,
    width: 292,
    wordBreak: 'break-word',
  },
  avatarButton: {
    margin: theme.spacing(0, 1),
    padding: 0,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  bigAvatar: {
    width: 62,
    height: 62,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
  },
  email: {
    fontSize: 12,
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
  const handleMenu = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserLogout = () => {
    handleClose();
    dispatch(actions.auth.logout());
  };

  if (!hasProfile || !hasPreferences) return null;

  return (
    <Fragment>
      <IconButton
        data-test="profileMenu"
        size="small"
        className={classes.avatarButton}
        aria-owns={open ? 'profileOptions' : null}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit">
        <Avatar alt={name} src={avatarUrl} className={classes.avatar} />
      </IconButton>
      <ArrowPopper
        id="profileOptions"
        className={classes.popperContent}
        anchorEl={anchorEl}
        placement="bottom-end"
        open={open}
        onClose={handleClose}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start">
          <Grid item>
            <Avatar alt={name} src={avatarUrl} className={classes.bigAvatar} />
          </Grid>
          <Grid item>
            <Typography variant="body1">{name}</Typography>
            <Typography className={classes.email} variant="h3">
              {email}
            </Typography>
          </Grid>
        </Grid>
        <div className={classes.actions}>
          <Button
            data-test="myAccountOrMyProfile"
            onClick={handleClose}
            variant="contained"
            color="secondary"
            component={Link}
            to={getRoutePath(
              permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
                ? '/myAccount/subscription'
                : '/myAccount/profiles'
            )}>
            {permissions.accessLevel === USER_ACCESS_LEVELS.ACCOUNT_OWNER
              ? 'My Account'
              : 'My Profile'}
          </Button>
          <Button
            data-test="signOut"
            onClick={handleUserLogout}
            variant="text"
            color="primary">
            Sign Out
          </Button>
        </div>
      </ArrowPopper>
    </Fragment>
  );
}
