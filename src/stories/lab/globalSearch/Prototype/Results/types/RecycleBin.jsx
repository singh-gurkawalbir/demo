import React from 'react';
import { Typography } from '@material-ui/core';
import GenericRow from './Generic';

export default function RecycleBin(props) {
  return (
    <GenericRow {...props}>
      <Typography variant="caption" color="textSecondary">{props.result.resourceType}</Typography>
    </GenericRow>
  );
}
