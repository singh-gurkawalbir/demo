import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Stepper from '../Stepper';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import ConnectDevice from '../ConnectDevice';
import actions from '../../../../../actions';

export default function MFASetup() {
  const dispatch = useDispatch();

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <Stepper index={1}>
        <Step1 />
      </Stepper>
      <Stepper index={2}>
        <Step2 />
      </Stepper>
      <Stepper index={3}>
        <Step3 />
      </Stepper>
      <ConnectDevice />
    </>
  );
}
