import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClipboardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor2';

const useStyles = makeStyles(theme => ({
  defaultPanelContainer: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    '& > div': {
      wordBreak: 'break-word',
    },
  },
}));

export default function DefaultPanel({ value, hideClipboard = false, contentType = 'json' }) {
  const classes = useStyles();

  if (!value) {
    return null;
  }

  return (
    <>
      <div className={classes.defaultPanelContainer}>
        <CodeEditor
          value={value}
          mode={contentType}
          readOnly
          showGutter={false}
            />
      </div>
      { !hideClipboard && <ClipboardPanel content={value} /> }
    </>
  );
}
