import { useEffect, useState, useCallback } from 'react';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import SaveAndCloseButton from './SaveAndCloseButton';
import TestButton from './TestButton';
import TestAndSaveButton from './TestAndSaveButton';
import TestSaveAndCloseButton from './TestSaveAndCloseButton';
import OAuthButton from './OAuthButton';
import NetsuiteValidateButton from './NetsuiteValidateButton';
import SaveAndCloseFileDefinitionButton from './SaveAndCloseFileDefinitionButton';
import SaveFileDefinitionButton from './SaveFileDefinitionButton';
import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';
import SaveAndContinueButton from './SaveAndContinueButton';

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
  cancel: CancelButton,
  save: SaveButton,
  saveandclose: SaveAndCloseButton,
  test: TestButton,
  testandsave: TestAndSaveButton,
  testsaveandclose: TestSaveAndCloseButton,
  oauth: OAuthButton,
  validate: NetsuiteValidateButton,
  savedefinition: SaveFileDefinitionButton,
  saveandclosedefinition: SaveAndCloseFileDefinitionButton,
  saveintegrationsettings: IntegrationSettingsSaveButton,
  saveandcontinue: SaveAndContinueButton,
};
