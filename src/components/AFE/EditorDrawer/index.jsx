import React, { useState, useMemo, useCallback, cloneElement, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
} from '@material-ui/core';
// TODO: Azhar, please fix these icons message.
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { preSaveValidate } from '../../../utils/editor';
import * as selectors from '../../../reducers';
import ViewColumnIcon from '../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../icons/LayoutLgLeftSmrightIcon';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import RightDrawer from '../../drawer/Right';
import Help from '../../Help';

const useStyles = makeStyles(theme => ({
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  helpTextButton: {
    marginLeft: theme.spacing(1),
  },
  actionContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    marginRight: theme.spacing(2),
    display: 'flex',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  editorToggleContainer: {
    marginRight: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  wrapper: {
    '& Button': {
      marginRight: theme.spacing(2),
    },
    '& Button:last-child': {
      marginRight: 0,
    },
  },
  autoPreview: {
    margin: theme.spacing(0, 1, 0, 1),
    '&:after': {
      content: '""',
      borderRight: `1px solid ${theme.palette.secondary.lightest}`,
      height: '80%',
      width: 1,
      position: 'absolute',
      right: -12,
    },
  },
}));

const DrawerActions = props => {
  const {
    action,
    toggleAction,
    showLayoutOptions,
    layout,
    handleLayoutChange,
    helpKey,
    helpTitle,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.toolbarContainer}>
      <div className={classes.actionContainer}>
        {/* it expects field to be a component to render */}
        {action}
      </div>
      <div className={classes.toggleContainer}>
        <div className={classes.editorToggleContainer}>
          {toggleAction}
        </div>
        {showLayoutOptions && (
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={handleLayoutChange}>
          <ToggleButton data-test="editorColumnLayout" value="column">
            <ViewColumnIcon />
          </ToggleButton>
          <ToggleButton data-test="editorCompactLayout" value="compact">
            <ViewCompactIcon />
          </ToggleButton>
          <ToggleButton data-test="editorRowLayout" value="row">
            <ViewRowIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        )}
      </div>
      {helpKey && (
      <Help
        title={helpTitle}
        className={classes.helpTextButton}
        helpKey={helpKey}
        fieldId={helpKey}
          />
      )}
    </div>
  );
};

/**
 * @param patchOnSave = false (default editor behaviour) or true (for resource patch on save)
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
  const activeEditorId = useMemo(() => activeEditorIndex ? `${id}-${activeEditorIndex}` : id, [
    id,
    activeEditorIndex,
  ]);

  const editor = useSelector(state => selectors.editor(state, activeEditorId));
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
  const showPreviewAction = useMemo(
    () =>
      !hidePreviewAction && editor && !editorViolations && !editor.autoEvaluate,
    [editor, editorViolations, hidePreviewAction]
  );
  const disableSave = useMemo(() => {
    // check for isEditorDirty !== undefined as isEditorDirty is not implemented for all editors
    const val =
      !editor ||
      editorViolations ||
      disabled ||
      (isEditorDirty !== undefined && !isEditorDirty);

    return !!val;
  }, [disabled, editor, editorViolations, isEditorDirty]);

  useEffect(() => {
    // patch current editor with autoEvaluate to maintain auto preview checkbox state
    // across editors
    if (editor.processor && activeEditorIndex !== undefined) {
      dispatch(actions.editor.patch(activeEditorId, { autoEvaluate: autoEvaluate.current }));
    }
  }, [dispatch, activeEditorId, editor.processor, activeEditorIndex]);

  const drawerActions = useMemo(() => (
    <DrawerActions
      action={action}
      toggleAction={toggleAction}
      showLayoutOptions={showLayoutOptions}
      layout={layout}
      handleLayoutChange={handleLayoutChange}
      helpKey={helpKey}
      helpTitle={helpTitle || title}
      />
  ), [action, handleLayoutChange, helpKey, helpTitle, layout, showLayoutOptions, title, toggleAction]);

  return (
    <RightDrawer
      path={path}
      height="tall"
      width="full"
      data-test={dataTest}
      title={title}
      variant="temporary"
      actions={drawerActions}
      onClose={handleClose} >
      {// Is there a better way to do this?
        cloneElement(children?.length ? children[activeEditorIndex] : children, {
          layout,
          editorId: activeEditorId})
}
      <div className={classes.actions}>
        <div className={classes.wrapper}>
          {patchOnSave ? (
            <>
              <EditorSaveButton
                key={activeEditorId}
                id={activeEditorId}
                variant="outlined"
                color="primary"
                dataTest="saveEditor"
                disabled={disableSave}
                submitButtonLabel="Save"
                flowId={flowId}
            />
              <EditorSaveButton
                key={`${activeEditorId}-close`}
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
        </div>
        <div className={classes.wrapper}>
          {showPreviewAction && (
          <Button
            data-test="previewEditorResult"
            variant="outlined"
            color="secondary"
            disabled={!!saveInProgress}
            className={classes.autoPreview}
            onClick={handlePreview}>
            Preview
          </Button>
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
        </div>
      </div>
    </RightDrawer>
  );
}
