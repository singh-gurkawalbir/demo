import { useCallback, useEffect, Fragment } from 'react';
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
import TextToggle from '../../../components/TextToggle';
import SettingsFormEditor from './';
import { isJsonString } from '../../../utils/string';

function toggleData(data, mode) {
  if (typeof data === 'string' && !isJsonString(data)) {
    return data;
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  const hasWrapper = !!(
    parsedData &&
    parsedData.resource &&
    parsedData.resource.settingsForm &&
    parsedData.resource.settingsForm.form !== undefined
  );
  let finalData = parsedData;

  console.log(mode, hasWrapper);

  if (mode === 'json') {
    // try and find only the form meta...
    // since the user can type anything, we are not guaranteed of a
    // json schema that contains an expected shape... for now, lets
    // assume we do.
    if (hasWrapper) {
      finalData = parsedData.resource.settingsForm.form;
    }
    // script
  } else if (!hasWrapper) {
    finalData = {
      resource: {
        settingsForm: { form: parsedData },
      },
      parentResource: {},
      license: {},
      parentLicense: {},
      sandbox: false,
    };
  }

  return JSON.stringify(finalData, null, 2);
}

const useStyles = makeStyles(theme => ({
  actionContainer: {
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
  actionSpacer: {
    flexGrow: 100,
  },
}));
const toggleOptions = [
  { label: 'JSON', value: 'json' },
  { label: 'Script', value: 'script' },
];

export default function EditorDrawer({
  editorId,
  onClose,
  settingsForm = {},
  resourceId,
  resourceType,
  disabled,
}) {
  const { form, init = {} } = settingsForm;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const settings = useSelector(
    state => selectors.resource(state, resourceType, resourceId).settings
  );
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
  const handleModeToggle = useCallback(
    mode => {
      const data = toggleData(editor.data, mode);

      console.log(mode, data);
      dispatch(actions.editor.patch(editorId, { mode, data }));
    },
    [dispatch, editor.data, editorId]
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

  useEffect(() => {
    dispatch(
      actions.editor.init(editorId, 'settingsForm', {
        scriptId: init._scriptId,
        initScriptId: init._scriptId,
        entryFunction: init.function || 'main',
        initEntryFunction: init.function || 'main',
        data: form,
        initData: form,
        fetchScriptContent: true, // @Adi: what is this?
        autoEvaluate: true,
        autoEvaluateDelay: 200,
        resourceId,
        resourceType,
        settings,
        previewOnSave: true,
        mode: 'json',
      })
    );
    // we only want to init the editor once per render (onMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if the editor is not yet initialized, then the auto-evaluate flag is undefined
  // so lets default to ON.
  const autoEvaluate = editor.autoEvaluate || editor.autoEvaluate === undefined;
  const drawerActions = (
    <Fragment>
      <TextToggle
        value={editor.mode}
        onChange={handleModeToggle}
        exclusive
        options={toggleOptions}
      />
      <div className={classes.actionSpacer} />
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
    </Fragment>
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
      <SettingsFormEditor
        editorId={editorId}
        disabled={disabled}
        resourceId={resourceId}
        resourceType={resourceType}
      />
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
