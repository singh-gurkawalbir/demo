import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClipboardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor2';

const useStyles = makeStyles(theme => ({
  defaultPanelContainer: {
    marginTop: theme.spacing(2),
    minHeight: theme.spacing(20),
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    color: theme.palette.text.primary,
    '& > div': {
      wordBreak: 'break-word',
    },
  },
  codeEditorWrapper: {
    height: props => props.height || 345,
    paddingTop: theme.spacing(1),
  },
}));

export default function DefaultPanel({ value, hideClipboard = false, height }) {
  const classes = useStyles({ height });

  return (
    <>
      <div
        className={classes.defaultPanelContainer}>
        <div className={classes.codeEditorWrapper}>
          <CodeEditor
            value={value}
            mode="json"
            readOnly
            showGutter={false}
            />
        </div>
      </div>
      { !hideClipboard && <ClipboardPanel content={value} /> }
    </>
  );
}
