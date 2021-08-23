import React from 'react';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancelBasic from './hooks/useHandleCancelBasic';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';
import SaveAndCloseMiniButtons from './SaveAndCloseMiniButtons';

// used in drawers/modals which are not forms
export default function SaveAndCloseMiniButtonGroup({
  isDirty,
  asyncKey,
  submitButtonLabel = 'Save & Close',
  submitTransientLabel = 'Saving...',
  status,
  handleSave,
  handleClose,
  shouldNotShowCancelButton,
  disabled,
  className,
}) {
  useClearAsyncStateOnUnmount(asyncKey);
  const inProgress = status === FORM_SAVE_STATUS.LOADING;

  const handleCancel = useHandleCancelBasic({isDirty, onClose: handleClose, handleSave});

  // if the form is disabled we should not show the confirm dialog
  const handleCancelClick = disabled ? handleClose : handleCancel;

  useTriggerCancelFromContext(asyncKey, handleCancelClick);

  return (
    <SaveAndCloseMiniButtons
      isDirty={isDirty}
      inProgress={inProgress}
      handleSave={handleSave}
      handleCancel={handleCancelClick}
      submitTransientLabel={submitTransientLabel}
      submitButtonLabel={submitButtonLabel}
      shouldNotShowCancelButton={shouldNotShowCancelButton}
      className={className}
      disabled={disabled}
    />
  );
}
