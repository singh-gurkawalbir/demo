import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
// TODO: @Azhar, can you fix this to use our own icon?
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import ViewColumnIcon from '../../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../../icons/LayoutLgLeftSmrightIcon';

export default function ToggleLayout({ editorId }) {
  const dispatch = useDispatch();
  const layout = useSelector(state => selectors._editor(state, editorId).layout);
  const handleToggle = (event, newLayout) => {
    dispatch(actions._editor.changeLayout(editorId, newLayout));
  };

  return (
    <ToggleButtonGroup
      value={layout}
      exclusive
      onChange={handleToggle}>
      <ToggleButton data-test="editorColumnLayout" value="column">
        <ViewColumnIcon />
      </ToggleButton>
      <ToggleButton data-test="editorCompactLayout" value="compact">
        <ViewCompactIcon />
      </ToggleButton>
      <ToggleButton data-test="editorRowLayout" value="row">
        <ViewRowIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
