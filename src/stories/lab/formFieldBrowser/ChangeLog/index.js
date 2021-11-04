import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useFieldPickerContext } from '../FieldPickerContext';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(1),
  },
}));

export default function ChangeLog() {
  const classes = useStyles();
  const { changeSet } = useFieldPickerContext();

  // console.log(changeSet);

  return (
    <div className={classes.container}>
      <Typography variant="h3">ChangeLog</Typography>
      {Object.keys(changeSet).map(fieldId => (
        <div key={fieldId}>
          {fieldId} {changeSet[fieldId] ? 'public' : 'private'}
        </div>
      ))}
    </div>
  );
}
