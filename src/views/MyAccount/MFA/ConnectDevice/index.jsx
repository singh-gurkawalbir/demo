import React from 'react';
import Stepper from '../Stepper';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';

export default function ConnectDevice() {
  return (
    <>
      <Stepper index={4}>
        <Step4 />
      </Stepper>
      <Stepper index={5}>
        <Step5 />
      </Stepper>
      <Stepper index={6} isLast>
        <Step6 />
      </Stepper>
    </>
  );
}
