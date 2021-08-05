
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import useHandleSaveAndAuth from './hooks/useHandleSaveAndAuth';

export default function OAuthAndCancel({
  resourceType,
  resourceId,
  onCancel,
  formKey,

}) {
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, getAsyncKey(resourceType, resourceId))
  );

  const handleSave = useHandleSaveAndAuth({formKey, resourceType, resourceId});

  return (
    <SaveAndCloseMiniResourceForm
      formKey={formKey}
      submitTransientLabel="Authorizing..."
      submitButtonLabel="Save & authorize"
      formSaveStatus={formSaveStatus}
      handleSave={handleSave}
      handleCancel={onCancel}
      forceIsDirty
    />
  );
}
