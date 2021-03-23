import React from 'react';
import { makeStyles } from '@material-ui/core';
import JsonContent from '../JsonContent';
import RawHtml from '../RawHtml';
import { isJsonString, isHTML} from '../../utils/string';

const useStyles = makeStyles({
  errorText: {
    overflow: 'hidden',
    maxWidth: 500,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 118px)',
    paddingLeft: 12,
    wordBreak: 'break-word',
    '& > * ': {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
    '& > * *': {
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  },
});

function FormatError({error}) {
  if (isJsonString(error)) {
    return <JsonContent json={error} />;
  }

  if (isHTML(error)) {
    return <RawHtml html={error} />;
  }

  // remaining case must be plain text error msg.
  return error;
}

export default function ErrorContent({error}) {
  const classes = useStyles();

  return (
    <span className={classes.errorText}>
      <FormatError error={error} />
    </span>
  );
}
