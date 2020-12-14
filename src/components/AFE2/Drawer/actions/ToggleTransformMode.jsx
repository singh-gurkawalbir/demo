import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import TextToggle from '../../../TextToggle';

const toggleOptions = [
  { label: 'Rules', value: 'transform' },
  { label: 'JavaScript', value: 'javascript' },
];

export default function ToggleTransformMode({ editorId }) {
  const dispatch = useDispatch();
  const activeProcessor = useSelector(state => selectors._editor(state, editorId).activeProcessor);

  const handleToggle =
  activeProcessor => dispatch(actions._editor.patchFeatures(editorId, {activeProcessor}));

  return (
    <TextToggle
      // Todo: disabled={disabled} we should have a selector that tells us if the editor is disabled.
      // so the components do not need to understand and use the user permissions.
      value={activeProcessor}
      onChange={handleToggle}
      exclusive
      options={toggleOptions}
    />
  );
}
