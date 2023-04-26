import React from 'react';
import { Spinner } from '@celigo/fuse-ui';
import { FilledButton, TextButton } from '../Buttons';

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
      <FilledButton
        data-test="save"
        disabled={!isDirty || inProgress || disabled}
        className={className}
        onClick={handleSave}>
        {inProgress && !disabled ? <Spinner size="small">{submitTransientLabel}</Spinner> : submitButtonLabel}
      </FilledButton>
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
