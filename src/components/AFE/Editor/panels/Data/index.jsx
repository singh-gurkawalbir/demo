import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';

export default function DataPanel({ editorId, mode }) {
  const dispatch = useDispatch();
  const sampleDataStatus = useSelector(state => selectors.editor(state, editorId).sampleDataStatus);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const data = useSelector(state => selectors.editorData(state, editorId));
  const {errorLine, dataError} = (useSelector(state => selectors.editorViolations(state, editorId), shallowEqual) || {});

  const handleChange = newData => {
    dispatch(actions.editor.patchData(editorId, newData));
  };

  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <Spinner center="screen" />
      ) : (
        <CodePanel
          name="data"
          value={data}
          mode={mode}
          readOnly={disabled}
          onChange={handleChange}
          errorLine={!!errorLine}
          hasError={!!dataError}
    />
      )}
    </>
  );
}
