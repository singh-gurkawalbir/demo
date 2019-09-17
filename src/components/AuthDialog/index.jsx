import { Typography, Button } from '@material-ui/core';
import { React, useEffect, useState, Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useSelector, useDispatch } from 'react-redux';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SignIn from '../../views/SignIn';
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
      <SignIn dialogOpen />
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
  const [date, setDate] = useState(null);
  const showSessionStatus = useSelector(state =>
    selectors.showSessionStatus(state, date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(Date.now());
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
