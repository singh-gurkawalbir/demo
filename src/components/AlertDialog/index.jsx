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
import { emptyList, HOME_PAGE_PATH} from '../../utils/constants';
import { OutlinedButton} from '../Buttons';
import { ConfirmDialog } from '../ConfirmDialog';

const useStyles = makeStyles({
  contentWrapper: {
    minWidth: 432,
    marginBottom: -104,
    paddingTop: 24,
  },
});

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
    <OutlinedButton
      data-test="ok"
      onClick={() => {
        window.location.replace(getRoutePath(HOME_PAGE_PATH));
      }}
     >
      Sign In
    </OutlinedButton>
  </ModalDialog>
);

const StaleUIVersion = () => (
  <ModalDialog show>
    <Typography variant="h3">Reload page</Typography>
    <Typography>
      It looks like your browser has cached an older version of our app.
      Click &apos;Reload&apos; to refresh the page.
    </Typography>
    <OutlinedButton
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
      >
      Reload
    </OutlinedButton>
  </ModalDialog>
);
const UserAcceptedAccountTransfer = () => (
  <ModalDialog show>
    <Typography variant="h3">Success!</Typography>
    <Typography>
      You are now the owner of this account. Go to <em>My account &gt; Users</em> to invite and manage permissions for other users in this account.
    </Typography>
    <OutlinedButton
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
     >
      Reload
    </OutlinedButton>
  </ModalDialog>
);
const WarningSessionContent = () => {
  const dispatch = useDispatch();

  return (
    <ConfirmDialog
      message="Your session is about to expire. Do you want to stay signed in?"
      title="Session expiring"
      hideClose
      buttons={[
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
      ]}
    />
  );
};

const ExpiredSessionContent = () => {
  const showSSOSignIn = useSelector(state => selectors.isUserAllowedOnlySSOSignIn(state));
  const classes = useStyles();

  return (
    <ModalDialog show disableEnforceFocus>
      <div>
        <Typography>Your session has expired</Typography>
        <br />
        <Typography>Please sign in again</Typography>
      </div>
      <div className={classes.contentWrapper}>
        {showSSOSignIn ? <SignInSSOForm /> : <SignInForm dialogOpen />}
      </div>
    </ModalDialog>
  );
};

export default function AlertDialog() {
  const dispatch = useDispatch();
  const classes = useStyles();

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
          {showSessionStatus === 'warning' ? (
            <WarningSessionContent />
          ) : (
            showSessionStatus === 'expired' && <ExpiredSessionContent />
          )}
        </Dialog>
      )}
      {!showSessionStatus && isUiVersionDifferent && <StaleUIVersion />}
      {!showSessionStatus && isUserAcceptedAccountTransfer && <UserAcceptedAccountTransfer />}
    </LoadResources>
  );
}
