import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import SaveAndCloseButtonGroup from '.';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import useHandleCancel from './hooks/useHandleCancel';

export default function SaveAndCloseButtonGroupAuto({formKey, onClose, onSave, disabled, disableOnCloseAfterSave, remountAfterSaveFn}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));
  const status = useSelector(state => selectors.asyncTaskStatus(state, formKey)); // get the status from the selector
  const handleClickWhenValid = useHandleClickWhenValid(formKey, onSave);

  useEffect(() => {
    if (status === FORM_SAVE_STATUS.COMPLETE && remountAfterSaveFn) {
      remountAfterSaveFn();
    }
  }, [remountAfterSaveFn, status]);
  const handleCancelClick = useHandleCancel({isDirty, onClose, handleSave: onSave});

  return (
    <SaveAndCloseButtonGroup
      isDirty={isDirty}
      status={status}
      onClose={handleCancelClick}
      onSave={handleClickWhenValid}
      disabled={disabled}
      disableOnCloseAfterSave={disableOnCloseAfterSave}
    />
  );
}
