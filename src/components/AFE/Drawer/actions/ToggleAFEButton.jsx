import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import TextToggle from '../../../TextToggle';
import Help from '../../../Help';
import { selectors } from '../../../../reducers';

const toggleEditorOptions = [
  { label: 'AFE 1.0', value: 1 },
  { label: 'AFE 2.0', value: 2 },
];

export default function ToggleAFEButton({ editorId }) {
  const dispatch = useDispatch();
  const editorSupportsV1V2data = useSelector(state => selectors.editor(state, editorId).editorSupportsV1V2data);
  const editorVersion = useSelector(state => selectors.editorDataVersion(state, editorId));
  const editorSupportsOnlyV2Data = useSelector(state => selectors.editorSupportsOnlyV2Data(state, editorId));
  const saveInProgress = useSelector(state => {
    const {saveStatus} = selectors.editor(state, editorId);

    return saveStatus === 'requested';
  });

  // AFE toggle is not shown if editor doesn't support v1 and v2 data both
  const hideAFEToggle = !editorSupportsV1V2data || editorSupportsOnlyV2Data;

  const handleVersionToggle = useCallback(
    newVersion => {
      dispatch(actions.editor.toggleVersion(editorId, newVersion));
    },
    [dispatch, editorId]
  );

  if (hideAFEToggle) return null;

  return (
    <>
      <TextToggle
        disabled={saveInProgress}
        value={editorVersion}
        onChange={handleVersionToggle}
        exclusive
        options={toggleEditorOptions}
      />
      <Help
        title="AFE"
        helpKey="afe.sampleDataSwitch"
      />
    </>
  );
}
