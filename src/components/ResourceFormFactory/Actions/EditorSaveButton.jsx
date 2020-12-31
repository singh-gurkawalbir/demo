import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';
import { preSaveValidate } from '../../../utils/editor';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

export default function EditorSaveButton(props) {
  const {
    id,
    submitButtonLabel = 'Save',
    variant = 'outlined',
    color = 'secondary',
    disabled = false,
    dataTest,
    onClose,
    flowId,
  } = props;
  const match = useRouteMatch();
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const editor = useSelector(state => selectors.editor(state, id));
  const { resourceType, saveStatus } = editor;
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, id)
  );
  const disableBtn = !editor || editorViolations || disabled || saveStatus === 'requested';
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.editorPatchStatus(state, id)
  );

  useEffect(() => {
    if (saveTriggered && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTriggered]);
  const onSave = useCallback(() => {
    dispatch(actions.editor.save(id, { flowId, match, editor }));
    setSaveTriggered(true);
  }, [dispatch, id, flowId, match, editor]);
  const { handleSubmitForm, disableSave, isSaving } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
    disableSaveOnClick,
    setDisableSaveOnClick,
  });
  const handleButtonClick = useCallback(() => {
    if (!preSaveValidate({ editor, enquesnackbar })) {
      return;
    }

    handleSubmitForm();
  }, [editor, enquesnackbar, handleSubmitForm]);

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={!!(disableBtn || disableSave)}
      onClick={handleButtonClick}>
      {isSaving ? 'Saving' : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
}
