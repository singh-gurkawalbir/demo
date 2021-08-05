import { Button } from '@material-ui/core';
import React from 'react';
import { FORM_SAVE_STATUS } from '../../utils/constants';
// import ActionGroup from '../ActionGroup';
import Spinner from '../Spinner';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancelBasic from './hooks/useHandleCancelBasic';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';

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

  useTriggerCancelFromContext(asyncKey, handleCancel);

  return (
    <>
      <Button
        variant="outlined"
        data-test="save"
        disabled={!isDirty || inProgress || disabled}
        color="secondary"
        onClick={handleSave}
        className={className}>
        {inProgress && !disabled ? <Spinner size="small">{submitTransientLabel}</Spinner> : submitButtonLabel}
      </Button>
      {shouldNotShowCancelButton ? null : (
        <Button
          variant="text"
          color="primary"
          data-test="cancel"
          disabled={inProgress}
          onClick={handleCancel}
          className={className}>
          Close
        </Button>
      )}
    </>
  );
}
