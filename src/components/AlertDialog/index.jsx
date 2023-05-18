import { Typography, Dialog, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignInForm from '../../views/SignIn/SigninForm';
import SignInSSOForm from '../../views/SignIn/SignInSSOForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';
import getRoutePath from '../../utils/routePaths';
import LoadResources from '../LoadResources';
import { emptyList, HOME_PAGE_PATH} from '../../constants';
import useConfirmDialog from '../ConfirmDialog';
import { FilledButton } from '../Buttons';
import { message } from '../../utils/messageStore';
import * as pendo from '../../utils/analytics/pendo';
import RawHtml from '../RawHtml';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    minWidth: 432,
    marginBottom: -104,
  },
  sessionExpiredInfo: {
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  sessionExpiredModal: {
    maxWidth: 470,
  },
}));

const LoggedInWithADifferentAccount = () => (
  <ModalDialog show>
    <div>Sign In</div>
    <>
      <Typography>
        Please click the following button to resume working
      </Typography>
      <br />
      This may have happened automatically because another user signed in from the same browser. To continue using this account, you will need to sign in again. This is done to protect your account and to ensure the privacy of your information.
    </>
    <FilledButton
      data-test="ok"
      onClick={() => {
        window.location.replace(getRoutePath(HOME_PAGE_PATH));
      }}
     >
      Sign In
    </FilledButton>
  </ModalDialog>
);

const StaleUIVersion = () => (
  <ModalDialog show>
    <div>Reload page</div>
    <Typography>
      {message.USER_SIGN_IN.CACHED}
    </Typography>
    <FilledButton
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
      >
      Reload
    </FilledButton>
  </ModalDialog>
);
const UserAcceptedAccountTransfer = () => (
  <ModalDialog show>
    <div>Success!</div>
    <Typography>
      <RawHtml html={message.USER_SIGN_IN.OWNER_ACCOUNT} />
    </Typography>
    <FilledButton
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
     >
      Reload
    </FilledButton>
  </ModalDialog>
);

const ExpiredSessionContent = () => {
  const dispatch = useDispatch();
  const showSSOSignIn = useSelector(state => selectors.isUserAllowedOnlySSOSignIn(state));
  const classes = useStyles();

  const handleUserLogout = () => {
    dispatch(actions.auth.logout());
  };

  useEffect(() => {
    pendo.stopSendingEvents();
  }, []);

  return (
    <ModalDialog show disableEnforceFocus onClose={handleUserLogout} className={classes.sessionExpiredModal}>
      <div>
        Your session has expired
      </div>
      <div className={classes.contentWrapper}>
        <Typography component="div" variant="body2" className={classes.sessionExpiredInfo}>
          {message.USER_SIGN_IN.SESSION_EXPIRED}
        </Typography>
        {showSSOSignIn ? <SignInSSOForm /> : <SignInForm dialogOpen />}
      </div>
    </ModalDialog>
  );
};

export default function AlertDialog() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { confirmDialog } = useConfirmDialog();
  const sessionValidTimestamp = useSelector(state => selectors.sessionValidTimestamp(state));
  const showSessionStatus = useSelector(state => selectors.showSessionStatus(state));
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));
  const isAuthenticated = useSelector(state => selectors.isAuthenticated(state));
  const isUiVersionDifferent = useSelector(selectors.isUiVersionDifferent);
  const isUserAcceptedAccountTransfer = useSelector(state =>
    selectors.isUserAcceptedAccountTransfer(state)
  );

  const isUserLoggedInDifferentTab = useSelector(state =>
    selectors.isUserLoggedInDifferentTab(state)
  );

  useEffect(() => {
    let versionPollingTimer;

    // stop polling when version is different
    if (isAuthenticated && !isUiVersionDifferent && !isUserAcceptedAccountTransfer) {
      versionPollingTimer = setTimeout(() => {
        dispatch(actions.app.fetchUiVersion());
      }, Number(process.env.UI_VERSION_PING));
    }

    return () => {
      clearTimeout(versionPollingTimer);
    };
  }, [dispatch, isAuthenticated, isUiVersionDifferent, isUserAcceptedAccountTransfer]);

  // useEffect for showing session expire warning
  useEffect(() => {
    if (showSessionStatus === 'warning') {
      confirmDialog({
        message: message.USER_SIGN_IN.SESSION_ABOUT_TO_EXPIRE,
        title: 'Session expiring',
        hideClose: true,
        buttons: [
          { label: 'Yes, keep me signed in',
            onClick: () => {
              dispatch(actions.user.profile.request('Refreshing session'));
            },
          },
          { label: 'No, sign me out',
            variant: 'text',
            onClick: () => {
              dispatch(actions.auth.logout());
            },
          },
        ],
      });
    } else {
      // close the confirm dialog or it will remain even after user signs in
      confirmDialog(null);
    }
  }, [confirmDialog, dispatch, showSessionStatus]);

  useEffect(() => {
    let warningSessionTimer;
    let expiredSessionTimer;

    if (sessionValidTimestamp) {
      warningSessionTimer = setTimeout(() => {
        dispatch(actions.auth.warning());
      }, Number(process.env.SESSION_EXPIRATION_INTERVAL) - Number(process.env.SESSION_WARNING_INTERVAL_PRIOR_TO_EXPIRATION));

      expiredSessionTimer = setTimeout(() => {
        dispatch(
          actions.auth.failure('Session expired due to extended inactivity')
        );
      }, Number(process.env.SESSION_EXPIRATION_INTERVAL));
    }

    return () => {
      clearTimeout(warningSessionTimer);
      clearTimeout(expiredSessionTimer);
    };
  }, [dispatch, sessionValidTimestamp]);
  if (isUserLoggedInDifferentTab) { return <LoggedInWithADifferentAccount />; }

  return (
    <LoadResources required resources={isAccountOwner ? 'ssoclients' : emptyList}>
      {showSessionStatus && (
        <Dialog disableEnforceFocus open className={classes.contentWrapper}>
          {showSessionStatus === 'expired' && <ExpiredSessionContent />}
        </Dialog>
      )}
      {!showSessionStatus && isUiVersionDifferent && <StaleUIVersion />}
      {!showSessionStatus && isUserAcceptedAccountTransfer && <UserAcceptedAccountTransfer />}
    </LoadResources>
  );
}
