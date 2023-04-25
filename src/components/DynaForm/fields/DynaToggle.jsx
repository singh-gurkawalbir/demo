import React from 'react';
import { Grid } from '@mui/material';
import { TextToggle } from '@celigo/fuse-ui';

export default function DynaToggle(props) {
  const { id, onFieldChange, label, value, options, disabled } = props;

  return (
    <Grid container>
      <Grid item xs={6}>
        {label}
      </Grid>
      <Grid item xs={6}>
        <TextToggle
          disabled={disabled}
          value={value}
          options={options}
          onChange={(event, val) => {
            onFieldChange(id, val);
          }}
        />
      </Grid>
    </Grid>
  );
}
