import React from 'react';
import { makeStyles } from '@material-ui/core';
import FieldList from '../FieldList';
import ChangeLog from '../ChangeLog';
import { FieldPickerProvider } from '../FieldPickerContext';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'stretch',
    width: '100%',
  },
  list: {
    flexGrow: 2,
  },
  changes: {
    flexGrow: 1,
  },
}));

export default function FormFieldBrowser() {
  const classes = useStyles();

  // console.log(fieldDefinitions);

  return (
    <FieldPickerProvider>
      <div className={classes.container}>
        <div className={classes.list}>
          <FieldList />
        </div>
        <div className={classes.changes}>
          <ChangeLog />
        </div>
      </div>
    </FieldPickerProvider>
  );
}
