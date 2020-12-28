import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import PanelLoader from '../../../../PanelLoader';

export default function DataPanel({ editorId, mode }) {
  const dispatch = useDispatch();
  const sampleDataStatus = useSelector(state => selectors._editor(state, editorId).sampleDataStatus);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const data = useSelector(state => selectors._editorData(state, editorId));
  const violations = useSelector(state => selectors._editorViolations(state, editorId));

  const handleChange = newData => {
    dispatch(actions._editor.patchData(editorId, newData));
  };

  return (
    <>
      {sampleDataStatus === 'requested' ? (
        <PanelLoader />
      ) : (
        <CodePanel
          name="data"
          value={data}
          mode={mode}
          readOnly={disabled}
          onChange={handleChange}
          errorLine={!!violations?.errorLine}
          hasError={!!violations?.dataError}
    />
      )}
    </>
  );
}
