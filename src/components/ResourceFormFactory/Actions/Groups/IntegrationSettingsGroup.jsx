import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import SaveAndCloseButtonGroupAuto from '../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import useHandleIntegrationSettings from './hooks/useHandleIntegrationSettings';

export default function IntegrationSettings({
  integrationId,
  childId,
  flowId,
  postProcessValuesFn,
  sectionId,
  formKey,
  onCancel,
  disabled,
}) {
  const onSave = useHandleIntegrationSettings({
    integrationId,
    childId,
    flowId,
    postProcessValuesFn,
    sectionId,
    formKey,
  });

  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const formSaveStatus = useSelector(state => {
    const formState = selectors.integrationAppSettingsFormState(
      state,
      integrationId,
      flowId,
      sectionId
    );

    return formState?.formSaveStatus;
  });

  return (
    <SaveAndCloseButtonGroupAuto
      isDirty={isDirty}
      disabled={disabled}
      asyncKey={formKey}
      status={formSaveStatus}
      onSave={onSave}
      onClose={onCancel}
      shouldHandleCancel
    />
  );
}
