import React from 'react';
import SaveAndCloseFileDefinitionButton from './SaveAndCloseFileDefinitionButton';

export default function SaveButton(props) {
  return <SaveAndCloseFileDefinitionButton
    {...props}
    submitButtonColor="primary"
    skipCloseOnSave
    submitButtonLabel="Save"
  />;
}
