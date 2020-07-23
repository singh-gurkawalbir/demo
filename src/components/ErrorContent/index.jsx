import React from 'react';
import { makeStyles } from '@material-ui/core';
import JsonContent from '../JsonContent';
import RawHtml from '../RawHtml';
import { isJsonString } from '../../utils/string';

const isHTML = text => /<\/?[a-z][\s\S]*>/i.test(text);

const useStyles = makeStyles({
  errorText: {
    maxHeight: 300,
    maxWidth: 500,
    overflow: 'auto',
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
    <div className={classes.errorText}>
      <FormatError error={error} />
    </div>
  );
}
