import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import ButtonGroup from '../../ButtonGroup';

export default function EditorPreviewButton({ editorId }) {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const autoEvaluate = useSelector(state => selectors._editor(state, editorId).autoEvaluate);

  const handlePreview = () => dispatch(actions._editor.previewRequest(editorId));
  const handleToggle = () => dispatch(actions._editor.toggleAutoPreview(editorId));

  return (
    <ButtonGroup>
      {!autoEvaluate && (
      <Button
        data-test="previewEditorResult"
        variant="outlined"
        color="secondary"
        onClick={handlePreview}>
        Preview
      </Button>
      )}
      <DynaCheckbox
        hideLabelSpacing
        id="disableAutoPreview"
        onFieldChange={handleToggle}
        label="Auto preview"
        value={autoEvaluate} />
    </ButtonGroup>
  );
}
