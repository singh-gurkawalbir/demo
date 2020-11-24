import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import TextToggle from '../../../TextToggle';

const toggleOptions = [
  { label: 'Rules', value: 0 },
  { label: 'JavaScript', value: 1 },
];

export default function ToggleFilterMode({ editorId }) {
  const dispatch = useDispatch();
  const handleToggle =
    activeEditorIndex => dispatch(actions._editor.patch(editorId, {activeEditorIndex}));

  // TODO: @Ashu, where would "activeEditorIndex" fit into the editor state? Its not data or a rule.
  const { activeEditorIndex } = useSelector(state => selectors._editor(state, editorId));

  return (
    <TextToggle
      // disabled={disabled} we should have a selector that tells us if the editor is disabled.
      // so the components do not need to understand and use the user permissions.
      value={activeEditorIndex}
      onChange={handleToggle}
      exclusive
      options={toggleOptions}
    />
  );
}
