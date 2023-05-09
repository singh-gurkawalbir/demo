import React from 'react';
import { useSelector } from 'react-redux';
import { FilledButton } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import { FORM_SAVE_STATUS } from '../../../constants';
import useHandleIntegrationSettings from './Groups/hooks/useHandleIntegrationSettings';

export default function IntegrationSettingsSaveButton(props) {
  const {
    integrationId,
    childId,
    flowId,
    postProcessValuesFn,
    sectionId,
    formKey,
    disabled,
  } = props;

  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const onSave = useHandleIntegrationSettings({
    integrationId,
    childId,
    flowId,
    postProcessValuesFn,
    sectionId,
    formKey,
  });

  const isSaving = useSelector(state => {
    const formState = selectors.integrationAppSettingsFormState(
      state,
      integrationId,
      flowId,
      sectionId
    );

    return FORM_SAVE_STATUS.LOADING === formState?.formSaveStatus;
  });

  return (
    <FilledButton
      disabled={disabled || !isDirty || isSaving}
      data-test="Save"
      onClick={onSave}>
      {isSaving ? 'Saving...' : 'Save'}
    </FilledButton>
  );
}
