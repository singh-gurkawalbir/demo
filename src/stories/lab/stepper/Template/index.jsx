import { Paper } from '@material-ui/core';
import React from 'react';
import StepperProto from '../Prototype';

export default function Template(args) {
  return (
    <Paper>
      <StepperProto {...args} />
    </Paper>
  );
}
