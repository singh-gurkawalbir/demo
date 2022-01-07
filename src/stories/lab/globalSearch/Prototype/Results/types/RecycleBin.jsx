import React from 'react';
import { Typography } from '@material-ui/core';
import GenericRow from './Generic';

export default React.forwardRef((props, ref) => (
  <GenericRow ref={ref} {...props}>
    <Typography variant="caption" color="textSecondary">{props.result.resourceType}</Typography>
  </GenericRow>
));
