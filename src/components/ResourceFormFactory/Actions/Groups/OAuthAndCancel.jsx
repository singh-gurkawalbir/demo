
import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import useHandleCancel from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancel';
import useHandleSaveAndAuth from './hooks/useHandleSaveAndAuth';
import { NextAndCancelButtonGroup } from './NextAndCancel';

export default function OAuthAndCancel({
  resourceType,
  resourceId,
  onCancel,
  formKey,

}) {
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, `${resourceType}-${resourceId}`)
  );
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const handleSave = useHandleSaveAndAuth({formKey, resourceType, resourceId});

  const handleCancelClick = useHandleCancel({
    isDirty, onClose: onCancel, handleSave,

  });

  return (
    <NextAndCancelButtonGroup
      submitTransientLabel="Authorizing..."
      submitButtonLabel="Save & authorize"
      isDirty={isDirty}
      formSaveStatus={formSaveStatus}
      handleSave={handleSave}
      handleCancelClick={handleCancelClick}

      />
  );
}
