import React from 'react';
import { Typography } from '@material-ui/core';
import GenericRow from './Generic';

function RecycleBinRow(props) {
  return (
    <GenericRow {...props}>
      <Typography variant="caption" color="textSecondary">{props.result.model}</Typography>
    </GenericRow>
  );
}

export default React.memo(RecycleBinRow);
