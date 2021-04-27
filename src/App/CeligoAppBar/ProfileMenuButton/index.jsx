import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import ArrowPopper from '../../../components/ArrowPopper';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { USER_ACCESS_LEVELS } from '../../../utils/constants';
import getRoutePath from '../../../utils/routePaths';
import IconTextButton from '../../../components/IconTextButton';

const useStyles = makeStyles(theme => ({
  profilePopper: {
    zIndex: theme.zIndex.drawer + 1,
    wordBreak: 'break-word',
    minWidth: 318,
    maxWidth: 320,
    left: '18px !important',
    top: '10px !important',
  },
  profilePopperArrow: {
    left: '276px !important',
  },
  profilePaper: {
    padding: '10px 8px',
  },
  avatarButton: {
    padding: 0,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  bigAvatar: {
    width: 62,
    height: 62,
    marginRight: 18,
    marginLeft: 6,
  },
  actions: {
    display: 'flex',
    paddingTop: 12,
    marginBottom: 14,
  },
  email: {
    fontSize: 12,
  },
  bottomActions: {
    background: theme.palette.background.paper2,
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    height: 30,
  },
  profileArea: {
    display: 'flex',
  },
  actionsBtn: {
    marginLeft: 13,
    padding: 0,
  },
  // TODO (Azhar): we have to make a variant for this btn
  myAccBtn: {
    borderColor: theme.palette.secondary.lightest,
    color: theme.palette.secondary.light,
    fontFamily: 'Roboto400',
    '&:hover': {
      borderColor: theme.palette.secondary.lightest,
      color: theme.palette.secondary.light,
    },
  },
  signOutBtn: {
    fontFamily: 'Roboto400',
    marginLeft: 10,
  },
  bottomActionsBtn: {
    fontFamily: 'source sans pro',
    padding: 0,
    paddingTop: 2,
  },
}));

export default function ProfileMenuButton() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const hasProfile = useSelector(state => selectors.hasProfile(state));
  const hasPreferences = useSelector(state => selectors.hasPreferences(state));
  const profile = useSelector(state => selectors.userProfile(state)) || {};
  const avatarUrl = useSelector(state => selectors.avatarUrl(state));
  const isAccountOwner = useSelector(
    state =>
      selectors.resourcePermissions(state).accessLevel ===
      USER_ACCESS_LEVELS.ACCOUNT_OWNER
  );
  const accountOwnerEmail = useSelector(state => selectors.accountOwner(state)?.email);
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
    <>
      <IconButton
        data-test="profileMenu"
        size="small"
        className={classes.avatarButton}
        aria-label="Avatar"
        aria-owns={open ? 'profileOptions' : null}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit">
        <Avatar alt={name} src={avatarUrl} className={classes.avatar} />
      </IconButton>
      <ArrowPopper
        id="profileOptions"
        classes={{
          popper: classes.profilePopper,
          paper: classes.profilePaper,
          arrow: classes.profilePopperArrow,
        }}
        anchorEl={anchorEl}
        placement="bottom-end"
        open={open}
        onClose={handleClose}>
        <div data-public className={classes.profileArea}>
          <div>
            <Avatar alt={name} src={avatarUrl} className={classes.bigAvatar} />
          </div>
          <div>
            <Typography variant="body1">{name}</Typography>
            <Typography className={classes.email} variant="body2">
              {email}
            </Typography>
            <Typography className={classes.email}>
              {accountOwnerEmail && (
                <>
                  Account owner
                  {!isAccountOwner && `: ${accountOwnerEmail}`}
                </>
              )}
            </Typography>
            <div>
              <div className={classes.actions}>
                <Button
                  data-test="myAccountOrMyProfile"
                  onClick={handleClose}
                  variant="outlined"
                  color="secondary"
                  className={classes.myAccBtn}
                  component={Link}
                  to={getRoutePath('/myAccount/profile')}>
                  {isAccountOwner ? 'My account' : 'My profile'}
                </Button>
                <Button
                  data-test="signOut"
                  className={classes.actionsBtn}
                  onClick={handleUserLogout}
                  variant="text"
                  color="primary">
                  Sign out
                </Button>
              </div>
            </div>
          </div>

        </div>
        <div className={classes.bottomActions}>
          <IconTextButton
            data-test="uxFeedback"
            component="a"
            variant="text"
            className={classes.bottomActionsBtn}
            color="primary"
            href="mailto:product_feedback@celigo.com"
            target="_blank"
            >
            Provide UX feedback
          </IconTextButton>
          <IconTextButton
            data-test="switchLegacy"
            component="a"
            variant="text"
            color="primary"
            className={classes.bottomActionsBtn}
            href="/legacy"
            >
            Switch to legacy UI
          </IconTextButton>
        </div>
      </ArrowPopper>
    </>
  );
}
