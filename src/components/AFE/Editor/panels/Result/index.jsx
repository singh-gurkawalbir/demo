import React from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function ResultPanel({ editorId, mode }) {
  const { data: result, warning } = useSelector(state => selectors.editorResult(state, editorId));
  const previewStatus = useSelector(state => selectors.editor(state, editorId).previewStatus);

  return (
    <>
      <CodePanel
        name="result"
        value={result}
        mode={mode}
        readOnly
        hasWarning={!!warning}
    />
      {previewStatus === 'requested' && (
      <Spinner overlay center="screen" size="small">Loading...</Spinner>
      )}
    </>
  );
}
