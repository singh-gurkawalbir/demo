import { Typography, Button } from '@material-ui/core';
import { React, useEffect, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignInForm from '../../views/SignIn/SigninForm';
import * as selectors from '../../reducers';
import actions from '../../actions';

const ExpiredSessionContent = () => (
  <Fragment>
    <DialogTitle>
      <Typography>Your Session has Expired</Typography>
      <br />
      <Typography>Please login again</Typography>
    </DialogTitle>
    <DialogContent>
      <SignInForm dialogOpen />
    </DialogContent>
  </Fragment>
);
const WarningSessionContent = () => {
  const dispatch = useDispatch();

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default function AlertDialog() {
  const sessionValidTimestamp = useSelector(state =>
    selectors.sessionValidTimestamp(state)
  );
  const dispatch = useDispatch();
  const showSessionStatus = useSelector(state =>
    selectors.showSessionStatus(state)
  );

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
      <Dialog open={!!showSessionStatus}>
        {showSessionStatus === 'warning' ? (
          <WarningSessionContent />
        ) : (
          showSessionStatus === 'expired' && <ExpiredSessionContent />
        )}
      </Dialog>
    </div>
  );
}
