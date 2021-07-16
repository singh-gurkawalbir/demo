import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import { AFE_SAVE_STATUS, FORM_SAVE_STATUS } from '../../../utils/constants';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import actions from '../../../actions';

export default function SaveButtonGroup({ editorId, onClose }) {
  const dispatch = useDispatch();
  const handleSave = useCallback(() => dispatch(actions.editor.saveRequest(editorId)), [dispatch, editorId]);
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));
  const saveStatus = useSelector(state => selectors.editor(state, editorId).saveStatus);

  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const editorViolations = useSelector(state => selectors.editorViolations(state, editorId));
  const disable = !!editorViolations || disabled;

  const getStatus = () => {
    switch (saveStatus) {
      case AFE_SAVE_STATUS.SUCCESS: return FORM_SAVE_STATUS.COMPLETE;
      case AFE_SAVE_STATUS.REQUESTED: return FORM_SAVE_STATUS.LOADING;
      default: return undefined;
    }
  };

  return (
    <SaveAndCloseButtonGroupAuto
      asyncKey={editorId}
      isDirty={isEditorDirty}
      status={getStatus()}
      onClose={onClose}
      onSave={handleSave}
      disabled={disable}
      shouldHandleCancel
    />
  );
}
