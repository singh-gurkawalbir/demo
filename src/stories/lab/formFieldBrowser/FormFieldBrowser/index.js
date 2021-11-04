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
    height: '100vh',
  },
  list: {
    flexGrow: 2,
    overflowY: 'auto',
  },
  changes: {
    flexGrow: 1,
    overflowY: 'auto',
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
