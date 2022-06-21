import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
        <HeaderWithHelpText title="Step1" helpKey="step1">
          <span>Get verification app</span>
        </HeaderWithHelpText>
        <div>Install any authenticator app that supports TOTP protocol or time-based one time password.</div>
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
