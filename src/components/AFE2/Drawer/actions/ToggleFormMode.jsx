import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import TextToggle from '../../../TextToggle';

const toggleOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'Script', value: 'script' },
];

export default function ToggleFormMode({ editorId }) {
  const dispatch = useDispatch();
  const activeProcessor = useSelector(state => selectors._editor(state, editorId).activeProcessor);
  const saveInProgress = useSelector(state => {
    const {saveStatus} = selectors._editor(state, editorId);

    return saveStatus === 'requested';
  });
  const handleToggle = activeProcessor => dispatch(actions._editor.patchFeatures(editorId, {activeProcessor}));

  return (
    <TextToggle
      disabled={saveInProgress}
      value={activeProcessor}
      onChange={handleToggle}
      exclusive
      options={toggleOptions}
    />
  );
}
