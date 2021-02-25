import React from 'react';
import { Button } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectors } from '../../../reducers';
import SaveButton from './SaveButton';
import ButtonGroup from '../../../components/ButtonGroup';

export default function ButtonPanel({disabled, onClose}) {
  const saveInProgress = useSelector(
    state => selectors.suiteScriptMappingSaveStatus(state).saveInProgress
  );

  return (
    <>
      <ButtonGroup>
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
        <Button
          variant="text"
          data-test="saveImportMapping"
          disabled={!!saveInProgress}
          onClick={onClose}>
          Cancel
        </Button>
      </ButtonGroup>
    </>
  );
}
