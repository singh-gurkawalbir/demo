import React from 'react';
import { makeStyles } from '@material-ui/core';
import EditorField from './DynaEditor';
import { validateMockResponseField } from '../../../utils/flowDebugger';

const useStyles = makeStyles(theme => ({
  editor: {
    height: 200,
  },
  rawViewWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(2),
  },
}));

export default function DynaMockResponse(props) {
  const classes = useStyles();

  return (
    <EditorField
      {...props}
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      mode="json"
      validateContent={validateMockResponseField}
    />
  );
}
