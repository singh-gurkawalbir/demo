
import React from 'react';
import SaveAndCloseButtonGroup from '.';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancelBasic from './hooks/useHandleCancelBasic';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';

export default function SaveAndCloseButtonGroupAuto({onClose, onSave, status, isDirty, shouldHandleCancel, asyncKey, disabled}) {
  useClearAsyncStateOnUnmount(asyncKey);

  const handleCancel = useHandleCancelBasic({isDirty, onClose, handleSave: onSave});
  const handleCancelClick = shouldHandleCancel ? handleCancel : onClose;

  useTriggerCancelFromContext(asyncKey, handleCancelClick);

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={handleCancelClick}
      onSave={onSave}
      disabled={disabled}
    />
  );
}
