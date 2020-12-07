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
  // TODO: @Ashu, where would "mode" fit into the editor state? Its not data or a rule.
  const { mode } = useSelector(state => selectors._editor(state, editorId));
  const handleToggle = mode => dispatch(actions._editor.patchFeatures(editorId, {mode}));

  return (
    <TextToggle
      value={mode}
      onChange={handleToggle}
      exclusive
      options={toggleOptions}
    />
  );
}
