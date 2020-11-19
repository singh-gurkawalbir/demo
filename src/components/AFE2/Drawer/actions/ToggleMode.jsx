import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import TextToggle from '../../../TextToggle';

const toggleOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'Script', value: 'script' },
];

export default function ToggleMode({ editorId }) {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => selectors.editor(state, editorId));
  const handleToggle = mode => dispatch(actions.editor.patch(editorId, {mode}));

  return (
    <TextToggle
      value={mode}
      onChange={handleToggle}
      exclusive
      options={toggleOptions}
    />
  );
}
