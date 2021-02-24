import React, { useState, useCallback, cloneElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider } from '@material-ui/core';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { preSaveValidate } from '../../../utils/editor';
import { getValidRelativePath } from '../../../utils/routePaths';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';

import DrawerActions from './DrawerActions';
import ActionGroup from '../../ActionGroup';

const useStyles = makeStyles(theme => ({
  divider: {
    margin: theme.spacing(0.5, 1, 0),
    height: 24,
    width: 1,
  },
}));

/**
 * @param patchOnSave = false (default editor behavior) or true (for resource patch on save)
 */
export default function EditorDrawer(props) {
  const {
    children,
    id,
    action,
    title,
    showLayoutOptions = true,
    onSave,
    onClose,
    disabled,
    dataTest = 'editor',
    hidePreviewAction = false,
    patchOnSave = false,
    toggleAction,
    flowId,
    path = id,
    helpKey,
    helpTitle,
    activeEditorIndex,
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();

  const [layout, setLayout] = useState(props.layout || 'compact');
  const activeEditorId = activeEditorIndex ? `${id}-${activeEditorIndex}` : id;

  const editor = useSelector(state => selectors.editor(state, activeEditorId), shallowEqual);
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, activeEditorId).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, activeEditorId)
  );

  // retain auto preview value across toggle editors
  const autoEvaluate = useRef(false);
  const handleAutoPreviewToggle = useCallback(() => {
    dispatch(actions.editor.patch(activeEditorId, { autoEvaluate: !editor.autoEvaluate }));
    autoEvaluate.current = !editor.autoEvaluate;
  }, [dispatch, editor.autoEvaluate, activeEditorId]);
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, activeEditorId)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(activeEditorId)),
    [dispatch, activeEditorId]
  );

  const saveEditor = useCallback(() => {
    if (onSave) {
      onSave(true, editor);
    }
    dispatch(actions.editor.saveComplete(activeEditorId));
  }, [dispatch, editor, activeEditorId, onSave]);

  const handleSave = useCallback(
    () => {
      if (!preSaveValidate({ editor, enquesnackbar })) {
        return;
      }
      saveEditor();
    },
    [editor, enquesnackbar, saveEditor]
  );

  const handleClose = useCallback(() => {
    history.goBack();
    if (onClose) {
      onClose();
    }
  }, [history, onClose]);
  const handleSaveAndClose = useCallback(() => {
    if (!preSaveValidate({ editor, enquesnackbar })) {
      return;
    }
    saveEditor();
    handleClose();
  }, [editor, enquesnackbar, saveEditor, handleClose]);

  const patchEditorLayoutChange = useCallback(() => {
    dispatch(actions.editor.changeLayout(activeEditorId));
  }, [dispatch, activeEditorId]);
  const handleLayoutChange = useCallback(
    (event, newLayout) => {
      patchEditorLayoutChange();
      newLayout && setLayout(newLayout);
    },
    [patchEditorLayoutChange, setLayout]
  );
  const handleCancelClick = useCallback(() => {
    if (isEditorDirty) {
      confirmDialog({
        title: 'Confirm cancel',
        message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: handleClose,
          },
          {
            label: 'No, go back',
            color: 'secondary',
          },
        ],
      });
    } else {
      handleClose();
    }
  }, [confirmDialog, isEditorDirty, handleClose]);

  const showPreviewAction = !hidePreviewAction && editor && !editorViolations && !editor.autoEvaluate;
  const disableSave =
      !editor ||
      !!editorViolations ||
      disabled ||
      (isEditorDirty !== undefined && !isEditorDirty);

  useEffect(() => {
    // patch current editor with autoEvaluate to maintain auto preview checkbox state
    // across editors
    if (editor.processor && activeEditorIndex !== undefined) {
      dispatch(actions.editor.patch(activeEditorId, { autoEvaluate: autoEvaluate.current }));
    }
  }, [dispatch, activeEditorId, editor.processor, activeEditorIndex]);

  return (
    <RightDrawer
      path={getValidRelativePath(path)}
      height="tall"
      width="full"
      data-test={dataTest}
      variant="temporary"
      onClose={handleCancelClick}>

      <DrawerHeader title={title} disableClose={!!saveInProgress}>
        <DrawerActions
          action={action}
          toggleAction={toggleAction}
          showLayoutOptions={showLayoutOptions}
          layout={layout}
          handleLayoutChange={handleLayoutChange}
          helpKey={helpKey}
          helpTitle={helpTitle || title}
        />
      </DrawerHeader>

      <DrawerContent>
        {
          cloneElement(children?.length ? children[activeEditorIndex] : children, {
            layout,
            editorId: activeEditorId})
        }
      </DrawerContent>

      <DrawerFooter>
        <ActionGroup>
          {patchOnSave ? (
            <>
              <EditorSaveButton
                id={activeEditorId}
                variant="outlined"
                color="primary"
                dataTest="saveEditor"
                disabled={disableSave}
                submitButtonLabel="Save"
                flowId={flowId}
            />
              <EditorSaveButton
                id={activeEditorId}
                variant="outlined"
                color="secondary"
                dataTest="saveAndCloseEditor"
                disabled={disableSave}
                onClose={handleSaveAndClose}
                submitButtonLabel="Save & close"
                flowId={flowId}
            />
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                data-test="saveEditor"
                disabled={disableSave}
                color="primary"
                onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outlined"
                data-test="saveAndCloseEditor"
                disabled={disableSave}
                color="secondary"
                onClick={handleSaveAndClose}>
                Save & close
              </Button>
            </>
          )}
          <Button
            variant="text"
            color="primary"
            data-test="closeEditor"
            disabled={!!saveInProgress}
            onClick={handleCancelClick}>
            Cancel
          </Button>
        </ActionGroup>

        <ActionGroup position="right">
          {showPreviewAction && (
          <>
            <Button
              data-test="previewEditorResult"
              variant="outlined"
              color="secondary"
              disabled={!!saveInProgress}
              onClick={handlePreview}>
              Preview
            </Button>
            <Divider orientation="vertical" className={classes.divider} />
          </>
          )}
          {!hidePreviewAction && (
          <DynaCheckbox
            disabled={!!saveInProgress}
            hideLabelSpacing
            id="disableAutoPreview"
            onFieldChange={handleAutoPreviewToggle}
            label="Auto preview"
            value={!!editor.autoEvaluate}
          />
          )}
        </ActionGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
