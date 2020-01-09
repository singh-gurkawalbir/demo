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
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
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
    marginRight: theme.spacing(3) - 2,
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
      { label: 'Mapping', value: 'expression' },
      { label: 'Javascript', value: 'script' },
    ],
    []
  );
  const editor = useSelector(state => selectors.editor(state, activeEditorId));
  const editorViolations = useSelector(state =>
    selectors.editorViolations(state, activeEditorId)
  );
  const handlePreview = useCallback(
    () => dispatch(actions.editor.evaluateRequest(activeEditorId)),
    [activeEditorId, dispatch]
  );
  const handleClose = useCallback(
    shouldCommit => {
      if (shouldCommit && !preSaveValidate({ editor, enquesnackbar })) {
        return;
      }

      if (onClose) {
        onClose(shouldCommit, editor);
      }
    },
    [editor, enquesnackbar, onClose]
  );
  const handleLayoutChange = (event, _layout) =>
    _layout && setState({ ...state, layout: _layout });
  const handleFullScreenClick = () =>
    setState({ ...state, fullScreen: !fullScreen });
  const handleEditorToggle = value =>
    setState({ ...state, activeEditorIndex: value === 'expression' ? 0 : 1 });
  const showPreviewAction =
    !hidePreviewAction && editor && !editorViolations && !editor.autoEvaluate;
  const disableSave = !editor || editorViolations || disabled;
  const handleCancel = useCallback(() => handleClose(), [handleClose]);
  const handleSave = useCallback(() => handleClose(true), [handleClose]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleCancel}
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
      <DialogContent
        style={size}
        className={classes.dialogContent}
        // key to be dependent on layout and fullscreen for content to re-render to fit in properly.
        key={`${id}-${layout}-${fullScreen ? 'lg' : 'sm'}`}>
        {// Is there a better way to do this?
        children[state.activeEditorIndex] &&
          cloneElement(children[state.activeEditorIndex], {
            layout,
            editorId: `${id}-${state.activeEditorIndex}`,
          })}
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
          onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          data-test="saveEditor"
          disabled={!!disableSave}
          color="primary"
          onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
