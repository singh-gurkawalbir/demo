/* eslint-disable react/jsx-pascal-case */
import React, { useCallback, cloneElement, useEffect, useRef } from 'react';
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
import _EditorSaveButton from '../../ResourceFormFactory/Actions/_EditorSaveButton';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import ButtonGroup from '../../ButtonGroup';
import DrawerActions from './DrawerActions';

const useStyles = makeStyles(theme => ({
  spaceBetween: {
    flex: 1,
  },
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

  const activeEditorId = activeEditorIndex ? `${id}-${activeEditorIndex}` : id;

  const editor = useSelector(state => selectors._editor(state, activeEditorId), shallowEqual);
  const saveInProgress = useSelector(
    state => selectors._editorSaveStatus(state, activeEditorId).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors._isEditorDirty(state, activeEditorId)
  );
  const editorLayout = useSelector(
    state => selectors._editorLayout(state, activeEditorId)
  );

  // TODO: check if this value can be stored in redux state instead
  // retain auto preview value across toggle editors
  const autoEvaluate = useRef(false);
  const handleAutoPreviewToggle = useCallback(() => {
    dispatch(actions._editor.toggleAutoPreview(activeEditorId));
    autoEvaluate.current = !editor.autoEvaluate;
  }, [dispatch, editor.autoEvaluate, activeEditorId]);
  const editorViolations = useSelector(state =>
    selectors._editorViolations(state, activeEditorId)
  );
  const handlePreview = useCallback(
    () => dispatch(actions._editor.previewRequest(activeEditorId)),
    [dispatch, activeEditorId]
  );

  const saveEditor = useCallback(() => {
    if (onSave) {
      onSave(editor);
    }
    dispatch(actions._editor.saveComplete(activeEditorId));
  }, [dispatch, editor, activeEditorId, onSave]);

  const handleSave = useCallback(
    () => {
      // TODO: test this for transform editor, we may not need this separate validate logic before save
      // add this in the processorLogic itself
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

  const handleLayoutChange = useCallback(
    (event, newLayout) => {
      dispatch(actions._editor.changeLayout(activeEditorId, newLayout));
    },
    [activeEditorId, dispatch]
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
      dispatch(actions._editor.toggleAutoPreview(activeEditorId, autoEvaluate.current));
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

      <DrawerHeader title={title}>
        <DrawerActions
          action={action}
          toggleAction={toggleAction}
          showLayoutOptions={showLayoutOptions}
          layout={editorLayout}
          handleLayoutChange={handleLayoutChange}
          helpKey={helpKey}
          helpTitle={helpTitle || title}
        />
      </DrawerHeader>

      <DrawerContent>
        {
          cloneElement(children?.length ? children[activeEditorIndex] : children, {
            // layout: editorLayout,
            editorId: activeEditorId})
        }
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          {patchOnSave ? (
            <>
              <_EditorSaveButton
                id={activeEditorId}
                variant="outlined"
                color="primary"
                dataTest="saveEditor"
                disabled={disableSave}
                submitButtonLabel="Save"
                flowId={flowId}
            />
              <_EditorSaveButton
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
        </ButtonGroup>
        <div className={classes.spaceBetween} />
        <ButtonGroup>
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
            disabled={disabled}
            hideLabelSpacing
            id="disableAutoPreview"
            onFieldChange={handleAutoPreviewToggle}
            label="Auto preview"
            value={!!editor.autoEvaluate}
          />
          )}
        </ButtonGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
