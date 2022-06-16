import React from 'react';
import Stepper from '../Stepper';
import Step1 from '../Step1';
import Step2 from '../Step2';
import Step3 from '../Step3';
import ConnectDevice from '../ConnectDevice';

export default function MFASetup() {
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
