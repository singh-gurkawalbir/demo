import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import ActionGroup from '../ActionGroup';
import useHandleClickWhenValid from '../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import useClearAsyncStateOnUnmount from './hooks/useClearAsyncStateOnUnmount';
import useHandleCancel from './hooks/useHandleCancel';
import useTriggerCancelFromContext from './hooks/useTriggerCancelFromContext';
import SaveAndCloseMiniButtons from './SaveAndCloseMiniButtons';

const MiniResourceForm = ({
  isDirty,
  inProgress,
  handleSave,
  handleCancel,
  submitTransientLabel,
  submitButtonLabel,
  shouldNotShowCancelButton,
  className,
  disabled,
}) => (
  <ActionGroup>
    <SaveAndCloseMiniButtons
      isDirty={isDirty}
      inProgress={inProgress}
      handleSave={handleSave}
      handleCancel={handleCancel}
      submitTransientLabel={submitTransientLabel}
      submitButtonLabel={submitButtonLabel}
      shouldNotShowCancelButton={shouldNotShowCancelButton}
      className={className}
      disabled={disabled}
    />
  </ActionGroup>
);

export default function SaveAndCloseMiniResourceForm({
  formKey,
  submitButtonLabel = 'Save & Close',
  submitTransientLabel = 'Saving...',
  formSaveStatus,
  handleSave,
  handleCancel,
  shouldNotShowCancelButton,
  disabled,
  className,
  forceIsDirty = false, // if it is true, the form will always be dirty, used in 'Save & authorize' connection
}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  useClearAsyncStateOnUnmount(formKey);
  const inProgress = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  const handleSaveWhenValid = useHandleClickWhenValid(formKey, handleSave);

  const handleCancelWithWarning = useHandleCancel({formKey, onClose: handleCancel, handleSave: handleSaveWhenValid});

  useTriggerCancelFromContext(formKey, handleCancelWithWarning);

  return (
    <MiniResourceForm
      isDirty={forceIsDirty || isDirty}
      inProgress={inProgress}
      submitButtonLabel={submitButtonLabel}
      submitTransientLabel={submitTransientLabel}
      handleSave={handleSaveWhenValid}
      handleCancel={handleCancelWithWarning}
      shouldNotShowCancelButton={shouldNotShowCancelButton}
      className={className}
      disabled={disabled}
    />
  );
}
