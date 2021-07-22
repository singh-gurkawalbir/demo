import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
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

  return (
    <SaveAndCloseMiniResourceForm
      formKey={formKey}
      submitButtonLabel={submitButtonLabel}
      formSaveStatus={formSaveStatus}
      handleSave={handleSave}
      handleCancel={onCancel}
    />
  );
}
