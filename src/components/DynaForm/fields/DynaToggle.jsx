import React from 'react';
import { Grid } from '@mui/material';
import TextToggle from '../../TextToggle';

export default function DynaToggle(props) {
  const { id, onFieldChange, label } = props;

  return (
    <Grid container>
      <Grid item xs={6}>
        {label}
      </Grid>
      <Grid item xs={6}>
        <TextToggle
          {...props}
          onChange={val => {
            onFieldChange(id, val);
          }}
          exclusive
        />
      </Grid>
    </Grid>
  );
}
