import { useState, cloneElement, useCallback, useMemo, useEffect } from 'react';
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
import TextToggle from '../../../components/TextToggle';
import ViewColumnIcon from '../../icons/LayoutTriVerticalIcon';
import ViewCompactIcon from '../../icons/LayoutLgLeftSmrightIcon';
import useConfirmDialog from '../../ConfirmDialog';

const useStyles = makeStyles(theme => ({
  dialogContent: {
    paddingBottom: 0,
  },
  editorTitle: {
    display: 'inline',
    paddingRight: theme.spacing(2),
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
    justifyContent: 'flex-start',
    marginLeft: theme.spacing(2),
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
}));

export default function ToggleEditorDialog(props) {
  const {
    children,
    id,
    open = true,
    action,
    title,
    labels = [],
    showLayoutOptions = true,
    showFullScreen = true,
    width = '70vw',
    height = '50vh',
    onClose,
    disabled,
    hidePreviewAction = false,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [state, setState] = useState({
    layout: props.layout || 'compact',
    fullScreen: props.fullScreen || false,
    activeEditorIndex: 0,
  });

  useEffect(() => {
    if (props.type) {
      setState({
        ...state,
        activeEditorIndex: props.type === 'expression' ? 0 : 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.type]);
  const { layout, fullScreen } = state;
  const size = fullScreen ? { height } : { height, width };
  const activeEditorId = useMemo(() => `${id}-${state.activeEditorIndex}`, [
    id,
    state.activeEditorIndex,
  ]);
  const toggleEditorOptions = useMemo(
    () => [
      { label: labels[0] || 'Rules', value: 'expression' },
      { label: labels[1] || 'JavaScript', value: 'script' },
    ],
    [labels]
  );
  const editor = useSelector(state => selectors.editor(state, activeEditorId));
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, activeEditorId)
  );
  const isEditorDirty = useSelector(state =>
    selectors.isEditorDirty(state, activeEditorId)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(activeEditorId)),
    [activeEditorId, dispatch]
  );
  const handleSave = useCallback(() => {
    if (!preSaveValidate({ editor, enquesnackbar })) {
      return;
    }

    if (onClose) {
      const shouldCommit = true;

      onClose(shouldCommit, editor);
    }
  }, [editor, enquesnackbar, onClose]);
  const handleCancelClick = useCallback(() => {
    if (isEditorDirty) {
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
    } else {
      onClose();
    }
  }, [confirmDialog, isEditorDirty, onClose]);
  const patchEditorLayoutChange = useCallback(() => {
    dispatch(actions.editor.changeLayout(activeEditorId));
  }, [activeEditorId, dispatch]);
  const handleLayoutChange = useCallback(
    (event, _layout) => {
      patchEditorLayoutChange();
      _layout && setState({ ...state, layout: _layout });
    },
    [patchEditorLayoutChange, state]
  );
  const handleFullScreenClick = useCallback(() => {
    patchEditorLayoutChange();
    setState({ ...state, fullScreen: !fullScreen });
  }, [fullScreen, patchEditorLayoutChange, state]);
  const handleEditorToggle = useCallback(
    value =>
      setState({ ...state, activeEditorIndex: value === 'expression' ? 0 : 1 }),
    [state]
  );
  const showPreviewAction = useMemo(
    () =>
      !hidePreviewAction && editor && !editorViolations && !editor.autoEvaluate,
    [editor, editorViolations, hidePreviewAction]
  );
  const disableSave = useMemo(() => !editor || editorViolations || disabled, [
    disabled,
    editor,
    editorViolations,
  ]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCancelClick}
      scroll="paper"
      maxWidth={false}>
      <div className={classes.toolbarContainer}>
        <div className={classes.toolbarItem}>
          <Typography variant="h5" className={classes.editorTitle}>
            {title}
          </Typography>
          <TextToggle
            disabled={disabled}
            value={state.activeEditorIndex === 0 ? 'expression' : 'script'}
            onChange={handleEditorToggle}
            exclusive
            options={toggleEditorOptions}
          />
        </div>
        <div className={classes.actionContainer}>
          {/* it expects field to be a component to render */}
          {action}
        </div>
        <div className={classes.toggleContainer}>
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
        children[state.activeEditorIndex] &&
          cloneElement(children[state.activeEditorIndex], {
            layout,
            editorId: `${id}-${state.activeEditorIndex}`,
          })}
      </DialogContent>
      <DialogActions className={classes.actions}>
        {showPreviewAction && (
          <Button
            variant="outlined"
            data-test="previewEditorResult"
            onClick={handlePreview}>
            Preview
          </Button>
        )}
        <Button
          variant="outlined"
          data-test="saveEditor"
          disabled={!!disableSave}
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
        <Button
          variant="text"
          color="primary"
          data-test="closeEditor"
          onClick={handleCancelClick}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
