import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ClipBoardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor';

const useStyles = makeStyles(theme => ({
  defaultPanelWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    background: theme.palette.background.paper,
    padding: theme.spacing(1),
    marginTop: -18,
  },
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
    height: 345,
    paddingTop: theme.spacing(1),
  },
}));

export default function DefaultPanel({ value }) {
  const classes = useStyles();

  return (
    <div
      className={classes.defaultPanelWrapper}>
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
      <ClipBoardPanel content={value} />
    </div>
  );
}
