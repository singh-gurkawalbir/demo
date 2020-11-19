import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import CodePanel from '../Code';
import PanelLoader from '../../../../PanelLoader';

export default function DataPanel({ editorId, mode, disabled }) {
  const dispatch = useDispatch();
  const initStatus = useSelector(state => selectors._editor(state, editorId).initStatus);
  const data = useSelector(state => selectors._editorData(state, editorId));
  const violations = useSelector(state =>
    selectors._editorViolations(state, editorId),
  );

  const handleChange = data => {
    // dispatch(actions.editor.patchData(value));
    dispatch(actions._editor.patch(editorId, { data }));
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
