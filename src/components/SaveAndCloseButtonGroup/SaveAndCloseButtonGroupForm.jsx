import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import SaveAndCloseButtonGroup from '.';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import useHandleCancel from './hooks/useHandleCancel';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';
import useHandleCloseOnSave from './hooks/useHandleCloseOnSave';
import useHandleRemountAfterSave from '../ResourceFormFactory/Actions/Groups/hooks/useHandleRemountAfterSave';

// Use this component for forms, it handles status and isDirty check on its own
export default function SaveAndCloseButtonGroupForm({formKey, onClose, onSave, disabled, disableOnCloseAfterSave, remountAfterSaveFn}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey)); // get the status from the selector

  const handleSave = useHandleRemountAfterSave(formKey, onSave, remountAfterSaveFn);
  const saveAndClose = useHandleCloseOnSave({onSave, status, onClose});
  const handleSaveAndClose = useHandleClickWhenValid(formKey, saveAndClose);
  const finalHandleSaveAndClose = (disableOnCloseAfterSave) ? handleSave : handleSaveAndClose;

  useClearAsyncStateOnUnmount(formKey);

  const handleCancelConfirm = useHandleCancel({formKey, isDirty, onClose, handleSave: handleSaveAndClose});

  // if the form is disabled we should not show the confirm dialog
  const handleCancelClick = disabled ? onClose : handleCancelConfirm;

  useTriggerCancelFromContext(formKey, handleCancelClick);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={handleCancelClick}
      handleSave={handleSave}
      handleSaveAndClose={finalHandleSaveAndClose}
      disabled={disabled}
    />
  );
}
