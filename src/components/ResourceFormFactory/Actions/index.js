import { useEffect, useState, useCallback } from 'react';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import TestButton from './TestButton';
import TestAndSaveButton from './TestAndSaveButton';
import OAuthButton from './OAuthButton';
import NetsuiteValidateButton from './NetsuiteValidateButton';
import SaveFileDefinitionButton from './SaveFileDefinitionButton';
import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';
import SaveAndContinueButton from './SaveAndContinueButton';

export const useLoadingSnackbarOnSave = props => {
  const { saveTerminated, onSave } = props;
  const [disableSave, setDisableSave] = useState(false);
  const handleSubmitForm = useCallback(
    values => {
      onSave(values);
      setDisableSave(true);
    },
    [onSave]
  );

  useEffect(() => {
    if (saveTerminated) {
      setDisableSave(false);
    }
  }, [saveTerminated]);

  return { handleSubmitForm, disableSave };
};

export default {
  cancel: CancelButton,
  save: SaveButton,
  test: TestButton,
  testandsave: TestAndSaveButton,
  oauth: OAuthButton,
  validate: NetsuiteValidateButton,
  savedefinition: SaveFileDefinitionButton,
  saveintegrationsettings: IntegrationSettingsSaveButton,
  saveandcontinue: SaveAndContinueButton,
};
