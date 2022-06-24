import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import Stepper from '../Stepper';
import MFACodeGeneration from '../MFACodeGeneration';
import MobileCodeVerification from '../MobileCodeVerification';
import ConnectDevice from '../ConnectDevice';
import HeaderWithHelpText from '../HeaderWithHelpText';
import actions from '../../../../../actions';

export default function MFASetup() {
  const dispatch = useDispatch();

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <Stepper index={1}>
        <HeaderWithHelpText title="Get verification app" helpKey="mfa.getVerificationApp">
          <Typography variant="body2" component="span">Get verification app</Typography>
        </HeaderWithHelpText>
        <Typography variant="body2">Install any authenticator app that supports TOTP protocol or time-based one time password.</Typography>
      </Stepper>
      <Stepper index={2}>
        <MFACodeGeneration />
      </Stepper>
      <Stepper index={3}>
        <MobileCodeVerification />
      </Stepper>
      <ConnectDevice />
    </>
  );
}
