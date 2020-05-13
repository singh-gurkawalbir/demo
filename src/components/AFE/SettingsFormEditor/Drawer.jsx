import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  Button,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import RightDrawer from '../../drawer/Right';
import SettingsFormEditor from './';

const useStyles = makeStyles(theme => ({
  actionContainer: {
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

export default function EditorDrawer({ editorId, onClose, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const editor = useSelector(state => selectors.editor(state, editorId));
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, editorId).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, editorId)
  );
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(editorId)),
    [dispatch, editorId]
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
  const handlePreviewChange = useCallback(
    () =>
      dispatch(
        actions.editor.patch(editorId, { autoEvaluate: !editor.autoEvaluate })
      ),
    [dispatch, editor.autoEvaluate, editorId]
  );
  const disableSave =
    !editor ||
    editor.error ||
    editorViolations ||
    (isEditorDirty !== undefined && !isEditorDirty);
  // if the editor is not yet initialized, then the autoevealuate flag is undefined
  // so lets default to ON.
  const autoEvaluate = editor.autoEvaluate || editor.autoEvaluate === undefined;
  const drawerActions = (
    <FormControlLabel
      control={
        <Checkbox
          checked={autoEvaluate}
          onChange={handlePreviewChange}
          name="autoEvaluate"
        />
      }
      label="Auto preview"
    />
  );

  return (
    <RightDrawer
      path="editSettings"
      height="tall"
      width="xl"
      // type="paper"
      title="Edit settings form"
      variant="temporary"
      actions={drawerActions}
      onClose={handleCancelClick}>
      <SettingsFormEditor editorId={editorId} {...rest} />
      <div className={classes.actionContainer}>
        {!editor.autoEvaluate && (
          <Button
            data-test="previewEditorResult"
            variant="outlined"
            onClick={handlePreview}
            disabled={!!editorViolations}>
            Preview
          </Button>
        )}
        <EditorSaveButton
          id={editorId}
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
