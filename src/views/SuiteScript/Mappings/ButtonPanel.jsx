import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import SaveButton from './SaveButton';
import ActionGroup from '../../../components/ActionGroup';
import TextButton from '../../../components/Buttons/TextButton';

export default function ButtonPanel({disabled, onClose}) {
  const saveInProgress = useSelector(
    state => selectors.suiteScriptMappingSaveStatus(state).saveInProgress
  );

  return (
    <>
      <ActionGroup>
        <SaveButton
          disabled={disabled || saveInProgress}
          color="primary"
          dataTest="saveImportMapping"
          submitButtonLabel="Save"
       />
        <SaveButton
          variant="outlined"
          color="secondary"
          dataTest="saveAndCloseImportMapping"
          onClose={onClose}
          disabled={disabled || saveInProgress}
          showOnlyOnChanges
          submitButtonLabel="Save & close"
        />
        <TextButton
          data-test="saveImportMapping"
          disabled={!!saveInProgress}
          onClick={onClose}>
          Cancel
        </TextButton>
      </ActionGroup>
    </>
  );
}
