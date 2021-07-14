import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import SaveAndCloseButtonGroup from '.';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';

export default function SaveAndCloseResourceForm({formKey, onClose, onSave, disabled, disableOnCloseAfterSave, status}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));
  const handleClickWhenValid = useHandleClickWhenValid(formKey, onSave);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={onClose}
      onSave={handleClickWhenValid}
      disabled={disabled}
      disableOnCloseAfterSave={disableOnCloseAfterSave}
    />
  );
}
