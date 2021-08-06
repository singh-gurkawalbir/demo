import { Button } from '@material-ui/core';
import React from 'react';
import Spinner from '../Spinner';

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
      <Button
        variant="outlined"
        data-test="save"
        disabled={!isDirty || inProgress || disabled}
        color="primary"
        className={className}
        onClick={handleSave}>
        {inProgress && !disabled ? <Spinner size="small">{submitTransientLabel}</Spinner> : submitButtonLabel}
      </Button>
      {shouldNotShowCancelButton ? null : (
        <Button
          variant="text"
          color="primary"
          data-test="cancel"
          disabled={inProgress}
          className={className}
          onClick={handleCancel}>
          Close
        </Button>
      )}
    </>
  );
}
