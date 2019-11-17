import { useState, cloneElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import ViewRowIcon from '@material-ui/icons/HorizontalSplit';
import ZoomOutIcon from '@material-ui/icons/ZoomOutMap';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { preSaveValidate } from './util';
import * as selectors from '../../../reducers';

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
    marginRight: theme.spacing(3) - 2,
    marginTop: 0,
    marginBottom: theme.spacing(2),
  },
}));

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
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [state, setState] = useState({
    layout: props.layout || 'compact',
    fullScreen: props.fullScreen || false,
  });
  const { layout, fullScreen } = state;
  const editor = useSelector(state => selectors.editor(state, id));
  const handlePreview = () => dispatch(actions.editor.evaluateRequest(id));
  const handleClose = shouldCommit => {
    if (shouldCommit && !preSaveValidate({ editor, enquesnackbar })) {
      return;
    }

    if (onClose) {
      onClose(shouldCommit, editor);
    }
  };

  const handleLayoutChange = (event, _layout) =>
    _layout && setState({ ...state, layout: _layout });
  const handleFullScreenClick = () =>
    setState({ ...state, fullScreen: !fullScreen });
  const size = fullScreen ? { height } : { height, width };
  const showPreviewAction =
    editor && !editor.violations && !editor.autoEvaluate;
  const disableSave = !editor || editor.violations || disabled;

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => handleClose()}
      scroll="paper"
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
              <ZoomOutIcon />
            </ToggleButton>
          )}
        </div>
      </div>
      <DialogContent style={size} className={classes.dialogContent}>
        {// Is there a better way to do this?
        children && cloneElement(children, { layout })}
      </DialogContent>
      <DialogActions className={classes.actions}>
        {showPreviewAction && (
          <Button data-test="previewEditorResult" onClick={handlePreview}>
            Preview
          </Button>
        )}
        <Button
          variant="text"
          color="primary"
          data-test="closeEditor"
          onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          data-test="saveEditor"
          disabled={!!disableSave}
          color="primary"
          onClick={() => handleClose(true)}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
