import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import SaveAndCloseButtonGroup from '.';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import useHandleCancel from './hooks/useHandleCancel';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';
import useHandleCloseOnSave from './hooks/useHandleCloseOnSave';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';

// All onSave functions are automatically trimmed
export default function SaveAndCloseResourceForm({formKey, onClose, onSave, disabled, disableOnCloseAfterSave, status}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));
  const handleSave = useHandleClickWhenValid(formKey, onSave);

  const saveOnClose = useHandleCloseOnSave({onSave: handleSave, status, onClose});
  const handleSaveAndClose = useHandleClickWhenValid(formKey, saveOnClose);
  const finalHandleSaveAndClose = (disableOnCloseAfterSave) ? handleSave : handleSaveAndClose;
  const handleCancelClick = useHandleCancel({formKey, onClose, handleSave: finalHandleSaveAndClose});

  useClearAsyncStateOnUnmount(formKey);
  useTriggerCancelFromContext(formKey, handleCancelClick);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={handleCancelClick}
      handleSave={handleSave}
      handleSaveAndClose={handleSaveAndClose}
      disabled={disabled}
    />
  );
}
