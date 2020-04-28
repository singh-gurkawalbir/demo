import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import RightDrawer from '../../drawer/Right';
import SettingsFormEditor from './';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(2),
    display: 'flex',
    marginRight: theme.spacing(2),
  },
  actions: {
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2),
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
}));

/**
 * @param patchOnSave = false (default editor behavior) or true (for resource patch on save)
 */
export default function EditorDrawer({ id, onClose, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const editor = useSelector(state => selectors.editor(state, id));
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, id).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, id)
  );
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, id)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(id)),
    [dispatch, id]
  );
  const handleSave = useCallback(() => {
    if (onClose) {
      onClose(true, editor);
    }
  }, [editor, onClose]);
  const handleCancelClick = useCallback(() => {
    if (!isEditorDirty) {
      return onClose();
    }

    confirmDialog({
      title: 'Confirm',
      message: `You have made changes in the editor. Are you sure you want to discard them?`,
      buttons: [
        {
          label: 'No',
        },
        {
          label: 'Yes',
          onClick: onClose,
        },
      ],
    });
  }, [confirmDialog, isEditorDirty, onClose]);
  const showPreviewAction = useMemo(
    () => editor && !editorViolations && !editor.autoEvaluate,
    [editor, editorViolations]
  );
  const disableSave = useMemo(() => {
    // check for isEditorDirty !== undefined as isEditorDirty is not implemented for all editors
    const val =
      !editor ||
      editorViolations ||
      (isEditorDirty !== undefined && !isEditorDirty);

    return !!val;
  }, [editor, editorViolations, isEditorDirty]);

  return (
    <RightDrawer
      path="editSettings"
      height="tall"
      width="xl"
      // type="paper"
      title="Edit settings form"
      variant="temporary">
      <SettingsFormEditor {...rest} />
      <div className={classes.actions}>
        <Button
          data-test="previewEditorResult"
          variant="outlined"
          onClick={handlePreview}
          disabled={showPreviewAction}>
          Preview
        </Button>
        <EditorSaveButton
          id={id}
          variant="outlined"
          color="primary"
          dataTest="saveEditor"
          disabled={disableSave}
          onClose={handleSave}
          submitButtonLabel="Save"
        />
        <Button
          variant="text"
          color="primary"
          data-test="closeEditor"
          disabled={!!saveInProgress}
          onClick={handleCancelClick}>
          Cancel
        </Button>
      </div>
    </RightDrawer>
  );
}
