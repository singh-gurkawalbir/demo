import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';
import Spinner from '../../../../../Spinner';

const overrides = { showGutter: false };

const useStyles = makeStyles(theme => ({
  message: {
    padding: theme.spacing(1),
  },
  readOnlyPanel: {
    background: theme.palette.background.paper2,
    height: '100%',
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
        <div className={classes.readOnlyPanel}>
          <Typography className={classes.message}>
            Click the ‘test form’ button above to preview form output.
          </Typography>
        </div>
        )
      )}
      {previewStatus === 'requested' && previewStatus !== 'error' && (
        <Spinner size="small" centerAll isOverlay>Loading... </Spinner>
      )}
    </>
  );
}
