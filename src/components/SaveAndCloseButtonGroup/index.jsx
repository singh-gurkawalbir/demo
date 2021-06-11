import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import ActionGroup from '../ActionGroup';
import useConfirmDialog from '../ConfirmDialog';
import Spinner from '../Spinner';

export default function SaveAndCloseButtonGroup({ disabled, isDirty, status, onClose, onSave }) {
  const { saveDiscardDialog } = useConfirmDialog();
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isSuccess = status === 'success';
  const inProgress = status === 'inProgress';

  const handleSaveAndClose = useCallback(() => {
    onSave();
    setCloseTriggered(true);
  }, [onSave]);

  const handleCancelClick = useCallback(() => {
    if (!isDirty) return onClose();

    // console.log('confirm dialog, isDirty:', isDirty);

    saveDiscardDialog({
      onSave: handleSaveAndClose,
      onDiscard: onClose,
    });
  }, [saveDiscardDialog, handleSaveAndClose, isDirty, onClose]);

  useEffect(() => {
    if (closeTriggered && isSuccess) onClose();
  }, [closeTriggered, onClose, isSuccess]);

  // console.log('disabled, !isDirty, inProgress', disabled, isDirty, inProgress);

  return (
    <ActionGroup>
      <Button
        variant="outlined"
        data-test="saveEditor"
        disabled={disabled || !isDirty || inProgress}
        color="primary"
        onClick={onSave}>
        {inProgress ? <Spinner size="small">Saving...</Spinner> : 'Save'}
      </Button>

      {(!disabled && isDirty && !inProgress) && (
      <Button
        variant="outlined"
        data-test="saveAndCloseEditor"
        color="secondary"
        onClick={handleSaveAndClose}>
        Save & close
      </Button>
      )}

      <Button
        variant="text"
        color="primary"
        data-test="closeEditor"
        disabled={inProgress}
        onClick={handleCancelClick}>
        Cancel
      </Button>
    </ActionGroup>
  );
}

SaveAndCloseButtonGroup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  status: PropTypes.oneOf([undefined, 'success', 'inProgress', 'fail']).isRequired,
  disabled: PropTypes.bool,
  isDirty: PropTypes.bool,
};

SaveAndCloseButtonGroup.defaultProps = {
  disabled: false,
  isDirty: false,
};

