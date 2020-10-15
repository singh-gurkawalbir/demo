import { Typography, Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignInForm from '../../views/SignIn/SigninForm';
import { selectors } from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';
import getRoutePath from '../../utils/routePaths';

const contentWrapper = {
  minWidth: 432,
  marginBottom: -104,
  paddingTop: 24,

};

const LoggedInWithADifferentAccount = () => (
  <ModalDialog show>
    <Typography variant="h3">Sign In</Typography>
    <>
      <Typography>
        Please click the following button to resume working
      </Typography>
      <br />
      This may have happened automatically because another user signed in from the same browser. To continue using this account, you will need to sign in again. This is done to protect your account and to ensure the privacy of your information.
    </>
    <Button
      data-test="ok"
      onClick={() => {
        window.location.replace(getRoutePath('/dashboard'));
      }}
      variant="outlined"
      color="primary">
      Sign In
    </Button>
  </ModalDialog>
);

const StaleUIVersion = () => (
  <ModalDialog show>
    <Typography variant="h3">Reload page</Typography>
    <Typography>
      It looks like your browser has cached an older version of our app.
      Click &apos;Reload&apos; to refresh the page.
    </Typography>
    <Button
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
      variant="outlined"
      color="primary">
      Reload
    </Button>
  </ModalDialog>
);
const UserAcceptedAccountTransfer = () => (
  <ModalDialog show>
    <Typography variant="h3">Success!</Typography>
    <Typography>
      You are now the owner of this account. Go to <em>My account &gt; Users</em> to invite and manage permissions for other users in this account.
    </Typography>
    <Button
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
      variant="outlined"
      color="primary">
      Reload
    </Button>
  </ModalDialog>
);
const WarningSessionContent = () => {
  const dispatch = useDispatch();

  return (
    <>
      <DialogTitle>
        <Typography>Your session is about to expire</Typography>
        <br />
        <Typography>
          Please click the following button to resume working
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Button
          data-test="resumeWorking"
          onClick={() => {
            dispatch(actions.user.profile.request('Refreshing session'));
          }}
          variant="contained"
          color="primary">
          Resume working
        </Button>
      </DialogContent>
    </>
  );
};

const ExpiredSessionContent = () => (
  <>
    <DialogTitle>
      <Typography>Your session has expired</Typography>
      <br />
      <Typography>Please sign in again</Typography>
    </DialogTitle>
    <DialogContent style={contentWrapper}>
      <SignInForm dialogOpen />
    </DialogContent>
  </>
);

export default function AlertDialog() {
  const sessionValidTimestamp = useSelector(state =>
    selectors.sessionValidTimestamp(state)
  );
  const dispatch = useDispatch();
  const showSessionStatus = useSelector(state =>
    selectors.showSessionStatus(state)
  );

  const isAuthenticated = useSelector(state =>
    selectors.isAuthenticated(state)
  );

  const isUiVersionOld = useSelector(selectors.isUIVersionOld);

  const isUserAcceptedAccountTransfer = useSelector(state =>
    selectors.isUserAcceptedAccountTransfer(state)
  );

  const isUserLoggedInDifferentTab = useSelector(state =>
    selectors.isUserLoggedInDifferentTab(state)
  );

  useEffect(() => {
    let versionPollingTimer;

    // stop polling when version is different
    if (isAuthenticated && !isUiVersionOld && !isUserAcceptedAccountTransfer) {
      versionPollingTimer = setTimeout(() => {
        dispatch(actions.app.fetchUiVersion());
      }, Number(process.env.UI_VERSION_PING));
    }

    return () => {
      clearTimeout(versionPollingTimer);
    };
  }, [dispatch, isAuthenticated, isUiVersionOld, isUserAcceptedAccountTransfer]);

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
    <div>
      {showSessionStatus && (
        <Dialog disableEnforceFocus open style={contentWrapper}>
          {showSessionStatus === 'warning' ? (
            <WarningSessionContent />
          ) : (
            showSessionStatus === 'expired' && <ExpiredSessionContent />
          )}
        </Dialog>
      )}
      {!showSessionStatus && isUiVersionOld && <StaleUIVersion />}
      {!showSessionStatus && isUserAcceptedAccountTransfer && <UserAcceptedAccountTransfer />}
    </div>
  );
}
