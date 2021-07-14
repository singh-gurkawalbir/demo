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
import SaveAndCloseButtonGroup from './Groups/SaveAndClose';
import NextAndCancel from './Groups/NextAndCancel';
import OAuthAndCancel from './Groups/OAuthAndCancel';
import TestAndSave from './Groups/TestAndSave';
import SaveFileDefinitions from './Groups/SaveFileDefinitions';
import ValidateAndSave from './Groups/ValidateAndSave';

export const useLoadingSnackbarOnSave = props => {
  const {
    saveTerminated,
    onSave,
    // TODO: ghost code disableSaveOnClick...we are not doing anything with this argument
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
  validateandsave: ValidateAndSave,
  testandsavegroup: TestAndSave,
  nextandcancel: NextAndCancel,
  saveandclosegroup: SaveAndCloseButtonGroup,
  oauthandcancel: OAuthAndCancel,
  savefiledefinitions: SaveFileDefinitions,
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
