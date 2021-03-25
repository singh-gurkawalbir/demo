import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Button, Divider } from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useConfirmDialog from '../../ConfirmDialog';
import EditorSaveButton from '../../ResourceFormFactory/Actions/EditorSaveButton';
import RightDrawer from '../../drawer/Right';
import DrawerHeader from '../../drawer/Right/DrawerHeader';
import DrawerContent from '../../drawer/Right/DrawerContent';
import DrawerFooter from '../../drawer/Right/DrawerFooter';
import TextToggle from '../../TextToggle';
import SettingsFormEditor from '.';
import { isJsonString } from '../../../utils/string';
import DynaCheckbox from '../../DynaForm/fields/checkbox/DynaCheckbox';
import ButtonGroup from '../../ButtonGroup';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { useSettingsPatch } from '../../../views/Integration/DIY/panels/Settings';

const emptyObj = {};

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

  // console.log(mode, hasWrapper);

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
        settingsForm: {
          form: parsedData || { fieldMap: {}, layout: { fields: [] } },
        },
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
  spaceBetween: {
    flex: 1,
  },
  divider: {
    margin: theme.spacing(0.5, 1, 0),
    height: 24,
    width: 1,
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
  sectionId,
  disabled,
  hideSaveAction = false,
  path = 'editSettings',
}) {
  const { form, init = emptyObj } = settingsForm;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();

  const settings = useSelectorMemo(selectors.mkGetCustomFormPerSectionId, resourceType, resourceId, sectionId || 'general')?.settings;

  const settingsFormPatchPath = useSettingsPatch(resourceId, sectionId, '/settingsForm');
  const scriptPatchPath = useSettingsPatch(resourceId, sectionId, '/content');

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
      title: 'You’ve got unsaved changes',
      message: 'Are you sure you want to leave this page and lose your unsaved changes?',
      buttons: [
        {
          label: 'Save Changes',
          onClick: onClose,
        },
        {
          label: 'Discard Changes',
          color: 'secondary',
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
    const initForm = form || {
      fieldMap: {},
      layout: { fields: [] },
    };
    const mode = init._scriptId ? 'script' : 'json';

    dispatch(
      actions.editor.init(editorId, 'settingsForm', {
        scriptId: init._scriptId,
        _init_scriptId: init._scriptId,
        entryFunction: init.function || 'main',
        _init_entryFunction: init.function || 'main',
        data: mode === 'script' ? toggleData(initForm, 'script') : initForm,
        _init_data: initForm,
        fetchScriptContent: true, // @Adi: what is this?
        autoEvaluate: true,
        autoEvaluateDelay: 200,
        resourceId,
        resourceType,
        scriptPatchPath,
        settingsFormPatchPath,
        settings,
        previewOnSave: true,
        mode,
      })
    );
    // we only want to init the editor once per render (onMount)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if the editor is not yet initialized, then the auto-evaluate flag is undefined
  // so lets default to ON.
  const autoEvaluate = editor.autoEvaluate || editor.autoEvaluate === undefined;

  return (
    <RightDrawer
      path={path}
      height="tall"
      width="xl"
      variant="temporary"
      onClose={handleCancelClick}>

      <DrawerHeader title="Form builder">
        <TextToggle
          value={editor.mode}
          onChange={handleModeToggle}
          exclusive
          options={toggleOptions}
        />
        <div className={classes.actionSpacer} />
      </DrawerHeader>

      <DrawerContent>
        <SettingsFormEditor
          editorId={editorId}
          disabled={disabled}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          {!hideSaveAction && (
          <>
            <EditorSaveButton
              id={editorId}
              variant="outlined"
              color="primary"
              dataTest="saveEditor"
              disabled={disableSave}
              submitButtonLabel="Save"
            />
            <EditorSaveButton
              id={editorId}
              variant="outlined"
              color="secondary"
              dataTest="saveAndCloseEditor"
              disabled={disableSave}
              onClose={handleSave}
              submitButtonLabel="Save & close"
            />
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
          {!editor.autoEvaluate && (
            <>
              <Button
                data-test="previewEditorResult"
                variant="outlined"
                onClick={handlePreview}
                disabled={!!editorViolations}>
                Preview
              </Button>
              <Divider orientation="vertical" className={classes.divider} />
            </>
          )}
          <DynaCheckbox
            hideLabelSpacing
            id="autoEvaluateSettings"
            onFieldChange={handlePreviewChange}
            label="Auto preview"
            value={autoEvaluate}
          />
        </ButtonGroup>
      </DrawerFooter>
    </RightDrawer>
  );
}
