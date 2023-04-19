import React from 'react';
import { Typography } from '@mui/material';
import GenericRow from './Generic';

function RecycleBinRow(props) {
  return (
    <GenericRow {...props}>
      <Typography variant="caption" color="textSecondary">{props.result.model}</Typography>
    </GenericRow>
  );
}

export default React.memo(RecycleBinRow);
