import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import EditorField from '../../DynaEditor';

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
      skipJsonParse
    />
  );
}
