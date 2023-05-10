import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextToggle } from '@celigo/fuse-ui';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

const toggleOptions = {
  filter: [
    { label: 'Rules', value: 'filter' },
    { label: 'JavaScript', value: 'javascript' },
  ],
  form: [
    { label: 'JSON', value: 'json' },
    { label: 'Script', value: 'script' },
  ],
  transform: [
    { label: 'Rules', value: 'transform' },
    { label: 'JavaScript', value: 'javascript' },
  ]};

export default function ToggleMode({ editorId, variant = 'filter' }) {
  const dispatch = useDispatch();
  const activeProcessor = useSelector(state => selectors.editorActiveProcessor(state, editorId));
  const saveInProgress = useSelector(state => {
    const {saveStatus} = selectors.editor(state, editorId);

    return saveStatus === 'requested';
  });
  const handleToggle = (event, activeProcessor) => dispatch(actions.editor.patchFeatures(editorId, {activeProcessor}));

  return (
    <TextToggle
      disabled={saveInProgress}
      value={activeProcessor}
      onChange={handleToggle}
      options={toggleOptions[variant]}
    />
  );
}
