import { Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import ActionGroup from '../ActionGroup';
import Spinner from '../Spinner';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';

export default function SaveAndCloseMiniResourceForm({
  formKey,
  submitButtonLabel = '',
  submitTransientLabel = '',
  formSaveStatus,
  handleSave,
  handleCancelClick,
}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  useClearAsyncStateOnUnmount(formKey);
  const inProgress = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  useTriggerCancelFromContext(formKey, handleCancelClick);

  return (
    <ActionGroup>
      <Button
        variant="outlined"
        data-test="save"
        disabled={!isDirty || inProgress}
        color="primary"
        onClick={handleSave}>
        {inProgress ? <Spinner size="small">{submitTransientLabel}</Spinner> : submitButtonLabel}
      </Button>

      <Button
        variant="text"
        color="primary"
        data-test="cancel"
        disabled={inProgress}
        onClick={handleCancelClick}>
        Cancel
      </Button>
    </ActionGroup>
  );
}
