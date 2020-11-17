import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { selectors } from '../../../reducers';
import { Button } from '@material-ui/core';
import actions from '../../../actions';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import ButtonGroup from '../../ButtonGroup';

export default function EditorPreviewButton({ editorId }) {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const autoEvaluate = useSelector(state => false
    // return selectors.editor.features(state, editorId).autoPreview;
  );

  const handlePreview = () => dispatch(actions.editor.evaluate(editorId));
  const handleToggle = () => dispatch(actions.editor.toggleAutoEvaluate(editorId));

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
