import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';

const overrides = { showGutter: false };

const useStyles = makeStyles(theme => ({
  message: {
    padding: theme.spacing(1),
  },
}));
export default function OutputPanel({ editorId }) {
  const classes = useStyles();
  const { formOutput, previewStatus} = useSelector(state => {
    const {formOutput, previewStatus} = selectors.editor(state, editorId);

    return { formOutput, previewStatus };
  });

  return (
    <>
      {formOutput ? (
        <CodePanel
          id="result"
          name="result"
          value={formOutput}
          mode="json"
          overrides={overrides}
          readOnly
      />
      ) : (
        previewStatus !== 'error' && (
        <Typography className={classes.message}>
          Click the ‘test form’ button above to preview form output.
        </Typography>
        )
      )}
    </>
  );
}
