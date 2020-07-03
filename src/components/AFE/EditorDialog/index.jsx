import React, { useState, useMemo, useCallback, cloneElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
// TODO: Azhar, please fix these icons message.
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { preSaveValidate } from './util';
import * as selectors from '../../../reducers';
import FullScreenOpenIcon from '../../icons/FullScreenOpenIcon';
import FullScreenCloseIcon from '../../icons/FullScreenCloseIcon';
import ViewColumnIcon from '../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../icons/LayoutLgLeftSmrightIcon';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    paddingBottom: 0,
  },
  toolbarContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(2),
    display: 'flex',
  },
  actionContainer: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(2),
    display: 'flex',
    marginRight: theme.spacing(2),
  },
  toolbarItem: {
    flex: '1 1 auto',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fullScreen: {
    marginLeft: theme.spacing(2),
  },
  actions: {
    justifyContent: 'space-between',
    marginLeft: theme.spacing(2),
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
  wrapper: {
    '& Button': {
      marginRight: '10px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
  editorToggleContainer: {
    marginRight: theme.spacing(2),
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
    }
  },
  previewCheckbox: {
    marginLeft: 8,
  },
  previewBtnContainer: {
    display: 'flex',
    minHeight: 29,
  }
}));
/**
 * @param patchOnSave = false (default editor behaviour) or true (for resource patch on save)
 */

export default function EditorDialog(props) {
  const {
    children,
    id,
    open = true,
    action,
    title,
    showLayoutOptions = true,
    showFullScreen = true,
    width = '70vw',
    height = '50vh',
    onClose,
    disabled,
    dataTest = 'editor',
    hidePreviewAction = false,
    patchOnSave = false,
    toggleAction,
    flowId,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [state, setState] = useState({
    layout: props.layout || 'compact',
    fullScreen: props.fullScreen || false,
  });
  const { layout, fullScreen } = state;
  const editor = useSelector(state => selectors.editor(state, id));
  const saveInProgress = useSelector(
    state => selectors.editorPatchStatus(state, id).saveInProgress
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, id)
  );
  const handleAutoPreviewToggle = useCallback(() => {
    dispatch(actions.editor.patch(id, { autoEvaluate: !editor.autoEvaluate }));
  }, [dispatch, editor.autoEvaluate, id]);
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, id)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(id)),
    [dispatch, id]
  );
  const handleSave = useCallback(
    shouldCommit => () => {
      if (shouldCommit && !preSaveValidate({ editor, enquesnackbar })) {
        return;
      }

      if (onClose) {
        onClose(shouldCommit, editor);
      }
    },
    [editor, enquesnackbar, onClose]
  );
  const patchEditorLayoutChange = useCallback(() => {
    dispatch(actions.editor.changeLayout(id));
  }, [dispatch, id]);
  const handleLayoutChange = useCallback(
    (event, _layout) => {
      patchEditorLayoutChange();
      _layout && setState({ ...state, layout: _layout });
    },
    [patchEditorLayoutChange, state]
  );
  const handleCancelClick = useCallback(() => {
    if (isEditorDirty) {
      confirmDialog({
        title: 'Confirm cancel',
        message: 'Are you sure you want to cancel? You have unsaved changes that will be lost if you proceed.',
        buttons: [
          {
            label: 'Yes, cancel',
            onClick: onClose,
          },
          {
            label: 'No, go back',
            color: 'secondary',
          }
        ],
      });
    } else {
      onClose();
    }
  }, [confirmDialog, isEditorDirty, onClose]);
  const handleFullScreenClick = useCallback(() => {
    patchEditorLayoutChange();
    setState({ ...state, fullScreen: !fullScreen });
  }, [fullScreen, patchEditorLayoutChange, state]);
  const size = useMemo(() => (fullScreen ? { height } : { height, width }), [
    fullScreen,
    height,
    width,
  ]);
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

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCancelClick}
      scroll="paper"
      data-test={dataTest}
      maxWidth={false}>
      <div className={classes.toolbarContainer}>
        <div className={classes.toolbarItem}>
          <Typography variant="h5">{title}</Typography>
        </div>
        <div className={classes.actionContainer}>
          {/* it expects field to be a component to render */}
          {action}
        </div>
        <div className={classes.toggleContainer}>
          {toggleAction}
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

          {showFullScreen && (
            <ToggleButton
              data-test="toggleEditorSize"
              className={classes.fullScreen}
              value="max"
              onClick={handleFullScreenClick}
              selected={fullScreen}>
              {fullScreen ? <FullScreenCloseIcon /> : <FullScreenOpenIcon />}
            </ToggleButton>
          )}
        </div>
      </div>
      <DialogContent style={size} className={classes.dialogContent}>
        {// Is there a better way to do this?
        children && cloneElement(children, { layout })
}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div className={classes.wrapper}>
          {patchOnSave ? (
            <>
              <EditorSaveButton
                id={id}
                variant="outlined"
                color="primary"
                dataTest="saveEditor"
                disabled={disableSave}
                submitButtonLabel="Save"
                flowId={flowId}
            />
              <EditorSaveButton
                id={id}
                variant="outlined"
                color="secondary"
                dataTest="saveAndCloseEditor"
                disabled={disableSave}
                onClose={handleSave(true)}
                submitButtonLabel="Save & close"
                flowId={flowId}
            />
            </>
          ) : (
            <Button
              variant="outlined"
              data-test="saveEditor"
              disabled={disableSave}
              color="primary"
              onClick={handleSave(true)}>
              Save
            </Button>
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
        <div className={classes.previewBtnContainer}>
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
            <div className={classes.previewCheckbox}>
              <DynaCheckbox
                disabled={disabled}
                hideLabelSpacing
                id="disableAutoPreview"
                onFieldChange={handleAutoPreviewToggle}
                label="Auto preview"
                value={!!editor.autoEvaluate}
          />
            </div>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}
