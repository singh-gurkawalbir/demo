import React from 'react';
import SaveAndCloseButtonGroup from '.';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancelBasic from './hooks/useHandleCancelBasic';
import useHandleCloseOnSave from './hooks/useHandleCloseOnSave';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';

// If you are not using formKey, use this component to pass in the required props (isDirty, status, onSave, onClose, asyncKey)
export default function SaveAndCloseButtonGroupAuto({onClose, onSave, status, isDirty, shouldHandleCancel, asyncKey, disabled}) {
  useClearAsyncStateOnUnmount(asyncKey);
  const handleSaveAndClose = useHandleCloseOnSave({onSave, status, onClose});

  const handleCancel = useHandleCancelBasic({isDirty, onClose, handleSave: handleSaveAndClose});
  const handleCancelClick = shouldHandleCancel ? handleCancel : onClose;

  useTriggerCancelFromContext(asyncKey, handleCancelClick);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      handleSave={onSave}
      handleSaveAndClose={handleSaveAndClose}
      onClose={handleCancelClick}
      disabled={disabled}
    />
  );
}
