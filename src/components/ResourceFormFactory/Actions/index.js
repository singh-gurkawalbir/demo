import { useEffect, useState, useCallback } from 'react';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import TestButton from './TestButton';
import TestAndSaveButton from './TestAndSaveButton';
import OAuthButton from './OAuthButton';
import NetsuiteValidateButton from './NetsuiteValidateButton';
import SaveFileDefinitionButton from './SaveFileDefinitionButton';
import IntegrationSettingsSaveButton from './IntegrationSettingsSaveButton';

export const useLoadingSnackbarOnSave = props => {
  const { saveTerminated, onSave, resourceType } = props;
  const [disableSave, setDisableSave] = useState(false);
  const [snackbar, closeSnackbar] = useEnqueueSnackbar();
  const handleSubmitForm = useCallback(
    values => {
      onSave(values);
      setDisableSave(true);
      snackbar({
        variant: 'info',
        message: `Saving your ${MODEL_PLURAL_TO_LABEL[resourceType] ||
          resourceType} `,
        persist: true,
      });
    },
    [onSave, resourceType, snackbar]
  );

  useEffect(() => closeSnackbar, [closeSnackbar]);
  useEffect(() => {
    if (saveTerminated) {
      setDisableSave(false);
      closeSnackbar();
    }
  }, [closeSnackbar, saveTerminated]);

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
};
