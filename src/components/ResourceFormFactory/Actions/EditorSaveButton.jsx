import React, { useCallback, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { useLoadingSnackbarOnSave } from '.';
import { preSaveValidate } from '../../AFE/EditorDialog/util';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

let saveTriggered = false;

export default function EditorSaveButton(props) {
  const {
    id,
    submitButtonLabel = 'Save',
    variant = 'outlined',
    color = 'secondary',
    disabled = false,
    dataTest,
    onClose,
  } = props;
  const [enquesnackbar] = useEnqueueSnackbar();
  const editor = useSelector(state => selectors.editor(state, id));
  const { resourceType } = editor;
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, id)
  );
  const disableBtn = !editor || editorViolations || disabled;
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.editorPatchStatus(state, id)
  );

  useEffect(() => {
    if (saveTriggered && saveCompleted && onClose) {
      onClose();
      saveTriggered = false;
    }
  }, [onClose, saveCompleted, saveTerminated]);
  const onSave = useCallback(() => {
    dispatch(actions.editor.save(id));
    saveTriggered = true;
  }, [dispatch, id]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
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
      {disableSave ? (
        <>
          <Spinner size={16} />
          Saving
        </>
      ) : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
}
