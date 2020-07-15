import { Typography, Button } from '@material-ui/core';
import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignInForm from '../../views/SignIn/SigninForm';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';

const contentWrapper = {
  minWidth: 432,
  marginBottom: -104,
  paddingTop: 24,

};
const StaleUIVersion = () => (
  <ModalDialog disableEnforceFocus show>
    <Typography>Please Reload Page</Typography>
    <Typography>It looks like your browser has cached an older version of our app, and we need to reload the page. Please click &apos;OK&apos; to proceed.</Typography>
    <Button
      data-test="ok"
      onClick={() => {
        window.location.reload();
      }}
      variant="contained"
      color="primary">
      ok
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
      <Typography>Your Session has Expired</Typography>
      <br />
      <Typography>Please login again</Typography>
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

  const isUiVersionDifferent = useSelector(state =>
    selectors.isUiVersionDifferent(state)
  );

  useEffect(() => {
    let versionPollingTimer;
    // stop polling when version is different
    if (isAuthenticated && !isUiVersionDifferent) {
      versionPollingTimer = setTimeout(() => {
        dispatch(actions.app.fetchUiVersion());
      }, 30000);
    }
    return () => {
      clearTimeout(versionPollingTimer);
    };
  }, [dispatch, isAuthenticated, isUiVersionDifferent]);

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


  return (
    <div>
      {showSessionStatus ?
        <Dialog disableEnforceFocus open style={contentWrapper}>
          {showSessionStatus === 'warning' ? (
            <WarningSessionContent />
          ) : (
            showSessionStatus === 'expired' && <ExpiredSessionContent />
          )}
        </Dialog>
        : isUiVersionDifferent && <StaleUIVersion />}
    </div>
  );
}
