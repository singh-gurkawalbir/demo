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
          <Typography component="span"><b>{fieldId}</b> should be </Typography>
          {changeSet[fieldId]
            ? (<Typography component="span"> instrumented </Typography>)
            : (<Typography component="span" color="error"> PII </Typography>)}
        </div>
      ))}
    </div>
  );
}
