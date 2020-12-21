import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../../reducers';
import CodePanel from '../../Code';

const overrides = { showGutter: false };

export default function OutputPanel({ editorId }) {
  const { formOutput, previewStatus} = useSelector(state => {
    const {formOutput, previewStatus} = selectors._editor(state, editorId);

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
        <Typography>
          Click the ‘test form’ button above to preview form output.
        </Typography>
        )
      )}
    </>
  );
}
