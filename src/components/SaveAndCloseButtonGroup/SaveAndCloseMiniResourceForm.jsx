import { Button } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import ActionGroup from '../ActionGroup';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import Spinner from '../Spinner';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancel from './hooks/useHandleCancel';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';

const MiniResourceForm = ({isDirty, inProgress, handleSave, handleCancel, submitTransientLabel, submitButtonLabel}) => (
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
      onClick={handleCancel}>
      Cancel
    </Button>
  </ActionGroup>
);
export default function SaveAndCloseMiniResourceForm({
  formKey,
  submitButtonLabel = '',
  submitTransientLabel = '',
  formSaveStatus,
  handleSave,
  handleCancel,
}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  useClearAsyncStateOnUnmount(formKey);
  const inProgress = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  const handleSaveWhenValid = useHandleClickWhenValid(formKey, handleSave);

  const handleCancelWithWarning = useHandleCancel({formKey, onClose: handleCancel, handleSave: handleSaveWhenValid});

  useTriggerCancelFromContext(formKey, handleCancelWithWarning);

  return (
    <MiniResourceForm
      isDirty={isDirty}
      inProgress={inProgress}
      submitButtonLabel={submitButtonLabel}
      submitTransientLabel={submitTransientLabel}
      handleSave={handleSaveWhenValid}
      handleCancel={handleCancelWithWarning}
    />
  );
}
