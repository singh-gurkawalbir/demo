import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spinner, FilledButton, OutlinedButton, TextButton} from '@celigo/fuse-ui';
import ActionGroup from '../ActionGroup';
import { FORM_SAVE_STATUS } from '../../constants';

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
      <FilledButton
        data-test="save"
        disabled={disabled || !isDirty || inProgress}
        onClick={handleSaveClick}>
        {inProgress ? <Spinner size="small">Saving...</Spinner> : 'Save'}
      </FilledButton>

      {(!disabled && isDirty && !inProgress) ? (
        <OutlinedButton
          data-test="saveAndClose"
          onClick={handleSaveAndCloseClick}>
          Save & close
        </OutlinedButton>
      ) : null}

      <TextButton
        data-test="cancel"
        disabled={inProgress}
        onClick={onClose}>
        Close
      </TextButton>
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

