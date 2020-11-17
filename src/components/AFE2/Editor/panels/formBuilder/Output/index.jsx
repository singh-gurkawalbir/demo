import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';

const overrides = { showGutter: false };

export default function OutputPanel({ editorId }) {
  const { formOutput, status} = useSelector(state => {
    const {formOutput, status} = selectors.editor(state, editorId).formOutput;

    return { formOutput, status };
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
        status !== 'error' && (
        <Typography>
          Click the ‘test form’ button above to preview form output.
        </Typography>
        )
      )}
    </>
  );
}
