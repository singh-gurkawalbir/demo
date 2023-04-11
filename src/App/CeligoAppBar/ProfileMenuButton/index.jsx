import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { ArrowPopper, Box, Tooltip, IconButton } from '@celigo/fuse-ui';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { USER_ACCESS_LEVELS } from '../../../constants';
import getRoutePath from '../../../utils/routePaths';
import {OutlinedButton, TextButton } from '../../../components/Buttons/index';
import ActionGroup from '../../../components/ActionGroup';

const useStyles = makeStyles(theme => ({
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
    paddingTop: 12,
    marginBottom: 14,
  },
  email: {
    fontSize: 12,
  },
  bottomActions: {
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRight: 'none',
    borderLeft: 'none',
  },
  actionsBtn: {
    marginLeft: 13,
    padding: 0,
  },
  bottomActionsBtn: {
    fontFamily: 'source sans pro',
    background: theme.palette.background.paper2,
    margin: '4px 0px',
    borderRadius: 0,
    height: 33,
  },
}));

function ProfileMenuButton() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const hasProfile = useSelector(state => selectors.hasProfile(state));
  const isMFASetupIncomplete = useSelector(selectors.isMFASetupIncomplete);
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
      <Tooltip title="Account">
        <IconButton
          data-test="profileMenu"
          size="small"
          aria-label="avatar"
          aria-owns={open ? 'profileOptions' : null}
          aria-haspopup="true"
          onClick={handleMenu}
          className={classes.avatarButton}
        >
          <Avatar alt={name} src={avatarUrl} className={classes.avatar} />
        </IconButton>
      </Tooltip>
      <ArrowPopper
        id="profileOptions"
        anchorEl={anchorEl}
        placement="bottom-end"
        open={open}
        onClose={handleClose}
        // The top margin offsets the arrow to render without overlapping the avatar
        sx={{ width: 320, mt: 1, p: '10px 8px' }}
      >
        <Box display="flex">
          {/* private to logrocket because user email and avatar can be disclosed */}
          <div data-private>
            <Avatar alt={name} src={avatarUrl} className={classes.bigAvatar} />
          </div>
          <div>
            <span data-private>
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
            </span>

            <ActionGroup className={classes.actions}>
              <OutlinedButton
                data-test="myAccountOrMyProfile"
                onClick={handleClose}
                color="secondary"
                component={Link}
                disabled={isMFASetupIncomplete}
                to={getRoutePath('/myAccount/profile')}
              >
                {isAccountOwner ? 'My account' : 'My profile'}
              </OutlinedButton>
              <TextButton
                data-test="signOut"
                className={classes.actionsBtn}
                onClick={handleUserLogout}
              >
                Sign out
              </TextButton>
            </ActionGroup>
          </div>
        </Box>
        <div className={classes.bottomActions}>
          <TextButton
            data-test="uxFeedback"
            component="a"
            className={classes.bottomActionsBtn}
            href="mailto:product_feedback@celigo.com"
            target="_blank"
            fullWidth
          >
            Provide feedback
          </TextButton>
        </div>
      </ArrowPopper>
    </>
  );
}

export default function ProfileMenuButtonMemo() {
  return useMemo(() => <ProfileMenuButton />, []);
}
