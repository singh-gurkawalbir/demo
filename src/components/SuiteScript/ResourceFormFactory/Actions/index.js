import { useEffect, useState, useCallback } from 'react';
import CancelButton from './CancelButton';
import SaveButton from './SaveButton';
import TestButton from './TestButton';
import TestAndSaveButton from './TestAndSaveButton';
import SuiteScriptIASettingsSaveButton from './SuiteScriptIASettingsSaveButton';

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
  suiteScriptSave: SuiteScriptIASettingsSaveButton,
  cancel: CancelButton,
  save: SaveButton,
  testandsave: TestAndSaveButton,
  test: TestButton,
};
