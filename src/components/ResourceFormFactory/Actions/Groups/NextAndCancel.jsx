import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import useHandleCancel from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancel';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import useHandleSubmit from './hooks/useHandleSubmit';

export default function NextAndCancel(props) {
  const {
    // we are removing this label let it change per button Group
    submitButtonLabel,
    closeAfterSave,
    resourceType,
    resourceId,
    isGenerate = false,
    flowId,
    onCancel,
    formKey,
  } = props;

  const formSaveStatus = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)?.formSaveStatus
  );

  const saveResource = useHandleSubmit({ resourceType,
    resourceId,
    isGenerate,
    flowId,
    formKey });
  const handleSave = useCallback(
    () => {
      saveResource(closeAfterSave);
    }, [saveResource, closeAfterSave]);
  const handleCloseAfterSave = useCallback(
    () => {
      saveResource(true);
    }, [saveResource]);

  const handleCancelClick = useHandleCancel({
    formKey, onClose: onCancel, handleSave: handleCloseAfterSave,

  });

  return (
    <SaveAndCloseMiniResourceForm
      formKey={formKey}
      submitTransientLabel="Saving..."
      submitButtonLabel={submitButtonLabel}
      formSaveStatus={formSaveStatus}
      handleSave={handleSave}
      handleCancelClick={handleCancelClick}
    />
  );
}
