import React from 'react';
import { makeStyles } from '@material-ui/core';
import EditorField from '../../DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 200,
  },
  rawViewWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
  },
});

export default function RawView(props) {
  const classes = useStyles();

  return (
    <EditorField
      {...props}
      label="Settings"
      helpKey="settings"
      className={classes.rawViewWrapper}
      editorClassName={classes.editor}
      mode="json"
    />
  );
}
