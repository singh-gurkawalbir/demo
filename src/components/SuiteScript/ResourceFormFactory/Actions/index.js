import { useEffect, useState, useCallback } from 'react';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import TestButton from './TestButton';
import TestAndSaveButton from './TestAndSaveButton';
import SuiteScriptIASettingsSaveButton from './SuiteScriptIASettingsSaveButton';
import SaveAndCloseButton from './SaveAndCloseButton';
import TestSaveAndCloseButton from './TestSaveAndCloseButton';
import TestAndSave from './Groups/TestAndSave';
import SaveAndClose from './Groups/SaveAndClose';

export const useLoadingSnackbarOnSave = props => {
  const {
    saveTerminated,
    onSave,
    disableSaveOnClick,
    setDisableSaveOnClick,
  } = props;
  const [isSaving, setIsSaving] = useState(false);
  const handleSubmitForm = useCallback(
    values => {
      onSave(values);
      if (setDisableSaveOnClick) setDisableSaveOnClick(true);
      setIsSaving(true);
    },
    [onSave, setDisableSaveOnClick]
  );

  useEffect(() => {
    if (saveTerminated) {
      if (setDisableSaveOnClick) setDisableSaveOnClick(false);
      setIsSaving(false);
    }
  }, [saveTerminated, setDisableSaveOnClick]);

  return { handleSubmitForm, disableSave: disableSaveOnClick, isSaving };
};

export default {
  testandsavegroup: TestAndSave,
  saveandclosegroup: SaveAndClose,
  suiteScriptSave: SuiteScriptIASettingsSaveButton,
  // TODO:deprecate these actions
  cancel: CancelButton,
  save: SaveButton,
  saveandclose: SaveAndCloseButton,
  testandsave: TestAndSaveButton,
  testsaveandclose: TestSaveAndCloseButton,
  test: TestButton,
};
