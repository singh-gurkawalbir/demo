import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import PanelLoader from '../../../../PanelLoader';

export default function DataPanel({ editorId, mode }) {
  const dispatch = useDispatch();
  const initStatus = useSelector(state => selectors._editor(state, editorId).initStatus);
  const disabled = useSelector(state => selectors._editor(state, editorId).disabled);
  const data = useSelector(state => selectors._editorData(state, editorId));
  const violations = useSelector(state => selectors._editorViolations(state, editorId));

  const handleChange = newData => {
    dispatch(actions._editor.patchData(editorId, newData));
  };

  return (
    <>
      {initStatus === 'requested' ? (
        <PanelLoader />
      ) : (
        <CodePanel
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
