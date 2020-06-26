import React from 'react';
import SaveAndCloseButton from './SaveAndCloseButton';

export default function SaveButton(props) {
  return <SaveAndCloseButton
    {...props}
    skipCloseOnSave
    submitButtonColor="primary"
    submitButtonLabel="Save"
  />;
}
