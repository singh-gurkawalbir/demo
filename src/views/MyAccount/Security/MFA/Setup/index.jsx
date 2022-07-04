import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '../Stepper';
import MFACodeGeneration from '../MFACodeGeneration';
import MobileCodeVerification from '../MobileCodeVerification';
import ConnectDevice from '../ConnectDevice';
import HeaderWithHelpText from '../HeaderWithHelpText';
import actions from '../../../../../actions';

const useStyles = makeStyles(() => ({
  verificationLabel: {
    '& .MuiFormLabel-root': {
      fontSize: 17,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
}));

export default function MFASetup() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <Stepper index={1}>
        <HeaderWithHelpText title="Get verification app" helpKey="mfa.getVerificationApp">
          <Typography variant="h5" component="span">Get verification app</Typography>
        </HeaderWithHelpText>
        <div>Install any authenticator app that supports TOTP protocol or time-based one time password.</div>
      </Stepper>
      <Stepper index={2}>
        <MFACodeGeneration />
      </Stepper>
      <Stepper index={3}>
        <MobileCodeVerification className={classes.verificationLabel} />
      </Stepper>
      <ConnectDevice />
    </>
  );
}
