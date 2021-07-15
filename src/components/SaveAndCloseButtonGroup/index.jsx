import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import ActionGroup from '../ActionGroup';
import Spinner from '../Spinner';
import { FORM_SAVE_STATUS } from '../../utils/constants';

export const CLOSE_AFTER_SAVE = true;

export default function SaveAndCloseButtonGroup({ disabled, disableOnCloseAfterSave, isDirty, status, onClose, onSave }) {
  const [closeTriggered, setCloseTriggered] = useState(false);
  const isSuccess = status === FORM_SAVE_STATUS.COMPLETE;
  const inProgress = status === FORM_SAVE_STATUS.LOADING;
  const handleSave = useCallback(() => {
    onSave(!CLOSE_AFTER_SAVE);
  }, [onSave]);
  const handleSaveAndClose = useCallback(() => {
    onSave(CLOSE_AFTER_SAVE);
    setCloseTriggered(true);
  }, [onSave]);

  useEffect(() => {
    if (disableOnCloseAfterSave) {
      return;
    }
    if (closeTriggered && isSuccess) onClose();
  }, [closeTriggered, onClose, isSuccess, disableOnCloseAfterSave]);

  // console.log('disabled, !isDirty, inProgress', disabled, isDirty, inProgress);

  return (
    <ActionGroup>
      <Button
        variant="outlined"
        data-test="saveEditor"
        disabled={disabled || !isDirty || inProgress}
        color="primary"
        onClick={handleSave}>
        {inProgress ? <Spinner size="small">Saving...</Spinner> : 'Save'}
      </Button>

      {(!disabled && isDirty && !inProgress) ? (
        <Button
          variant="outlined"
          data-test="saveAndCloseEditor"
          color="secondary"
          onClick={handleSaveAndClose}>
          Save & close
        </Button>
      ) : null}

      <Button
        variant="text"
        color="primary"
        data-test="closeEditor"
        disabled={inProgress}
        onClick={onClose}>
        Cancel
      </Button>
    </ActionGroup>
  );
}

SaveAndCloseButtonGroup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  status: PropTypes.oneOf([undefined, 'success', 'inProgress', 'fail']),
  disableOnCloseAfterSave: PropTypes.bool,
  disabled: PropTypes.bool,
  isDirty: PropTypes.bool,
};

SaveAndCloseButtonGroup.defaultProps = {
  disabled: false,
  isDirty: false,
  disableOnCloseAfterSave: false,
};

