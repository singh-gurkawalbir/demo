import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClipboardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor2';

const useStyles = makeStyles(theme => ({
  defaultPanelContainer: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    color: theme.palette.text.primary,
    '& > div': {
      wordBreak: 'break-word',
    },
  },
}));

export default function DefaultPanel({ value, hideClipboard = false, height }) {
  const classes = useStyles({ height });

  return (
    <>
      <div className={classes.defaultPanelContainer}>
        <CodeEditor
          value={value}
          mode="json"
          readOnly
          showGutter={false}
            />
      </div>
      { !hideClipboard && <ClipboardPanel content={value} /> }
    </>
  );
}
