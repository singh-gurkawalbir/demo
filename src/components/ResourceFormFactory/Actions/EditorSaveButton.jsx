import { useCallback, useState, useEffect, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { useLoadingSnackbarOnSave } from '.';
import { preSaveValidate } from '../../AFE/EditorDialog/util';
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
  } = props;
  const [saveTrigerred, setSaveTriggered] = useState(false);
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
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
  const onSave = useCallback(() => {
    dispatch(actions.editor.save(id));
    setSaveTriggered(true);
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
        <Fragment>
          <Spinner size={16} />
          Saving
        </Fragment>
      ) : (
        <Fragment>{submitButtonLabel}</Fragment>
      )}
    </Button>
  );
}
