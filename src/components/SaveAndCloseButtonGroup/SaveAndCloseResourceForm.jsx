import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import SaveAndCloseButtonGroup from '.';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import useHandleCancel from './hooks/useHandleCancel';

// All onSave functions are automatically trimmed
export default function SaveAndCloseResourceForm({formKey, onClose, onSave, disabled, disableOnCloseAfterSave, status}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));
  const handleClickWhenValid = useHandleClickWhenValid(formKey, onSave);
  const handleCancelClick = useHandleCancel({formKey, onClose, handleSave: handleClickWhenValid});

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={handleCancelClick}
      onSave={handleClickWhenValid}
      disabled={disabled}
      disableOnCloseAfterSave={disableOnCloseAfterSave}
    />
  );
}
