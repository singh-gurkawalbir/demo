import React from 'react';
import Spinner from '../Spinner';
import { OutlinedButton, TextButton } from '../Buttons';

export default function SaveAndCloseMiniButtons({
  isDirty,
  inProgress,
  handleSave,
  handleCancel,
  submitTransientLabel,
  submitButtonLabel,
  shouldNotShowCancelButton,
  className,
  disabled,
}) {
  return (
    <>
      <OutlinedButton
        data-test="save"
        disabled={!isDirty || inProgress || disabled}
        className={className}
        onClick={handleSave}>
        {inProgress && !disabled ? <Spinner size="small">{submitTransientLabel}</Spinner> : submitButtonLabel}
      </OutlinedButton>
      {shouldNotShowCancelButton ? null : (
        <TextButton
          data-test="cancel"
          disabled={inProgress}
          className={className}
          onClick={handleCancel}>
          Close
        </TextButton>
      )}
    </>
  );
}
