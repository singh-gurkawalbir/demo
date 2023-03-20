import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ClipboardPanel from '../ClipboardPanel';
import CodeEditor from '../../../CodeEditor2';
import { isJsonString } from '../../../../utils/string';
import { withIsLoggable } from '../../../IsLoggableContextProvider';
import isLoggableAttr from '../../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  defaultPanelContainer: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    minHeight: theme.spacing(26),
    '& > div': {
      wordBreak: 'break-word',
    },
    '& > div[id="ace-editor"]': {
      minHeight: theme.spacing(26),
    },
  },
}));

function DefaultPanel({ value, isLoggable, hideClipboard = false, contentType = 'json' }) {
  const classes = useStyles();

  if (!value) {
    return null;
  }

  let content = value;

  if (contentType === 'json' && isJsonString(value)) {
    content = JSON.parse(value);
  }

  return (
    <>
      <div className={classes.defaultPanelContainer} {...isLoggableAttr(isLoggable)} >
        <CodeEditor
          value={content}
          mode={contentType}
          readOnly
          showGutter={false}
            />
      </div>
      { !hideClipboard && <ClipboardPanel content={content} /> }
    </>
  );
}
export default withIsLoggable(DefaultPanel);
