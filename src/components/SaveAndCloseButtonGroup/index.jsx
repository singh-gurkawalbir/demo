import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import ActionGroup from '../ActionGroup';
import Spinner from '../Spinner';
import { FORM_SAVE_STATUS } from '../../utils/constants';

export const CLOSE_AFTER_SAVE = true;
export default function SaveAndCloseButtonGroup({ disabled, isDirty, status, onClose, handleSave, handleSaveAndClose}) {
  const inProgress = status === FORM_SAVE_STATUS.LOADING;

  const handleSaveClick = useCallback(() => {
    handleSave(!CLOSE_AFTER_SAVE);
  }, [handleSave]);

  const handleSaveAndCloseClick = useCallback(() => {
    handleSaveAndClose(CLOSE_AFTER_SAVE);
  }, [handleSaveAndClose]);

  return (
    <ActionGroup>
      <Button
        variant="contained"
        data-test="save"
        disabled={disabled || !isDirty || inProgress}
        color="primary"
        onClick={handleSaveClick}>
        {inProgress ? <Spinner size="small">Saving...</Spinner> : 'Save'}
      </Button>

      {(!disabled && isDirty && !inProgress) ? (
        <Button
          variant="contained"
          data-test="saveAndClose"
          color="primary"
          onClick={handleSaveAndCloseClick}>
          Save & close
        </Button>
      ) : null}

      <Button
        variant="text"
        color="secondary"
        data-test="cancel"
        disabled={inProgress}
        onClick={onClose}>
        Close
      </Button>
    </ActionGroup>
  );
}

SaveAndCloseButtonGroup.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleSaveAndClose: PropTypes.func.isRequired,
  status: PropTypes.oneOf([undefined, 'success', 'inProgress', 'fail']),
  disabled: PropTypes.bool,
  isDirty: PropTypes.bool,
};

SaveAndCloseButtonGroup.defaultProps = {
  disabled: false,
  isDirty: false,
  disableOnCloseAfterSave: false,
};

