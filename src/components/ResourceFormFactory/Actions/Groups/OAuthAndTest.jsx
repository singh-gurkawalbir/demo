import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import useHandleSaveAndAuth from './hooks/useHandleSaveAndAuth';
import TestButton from './TestAndSave/TestButton';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';
import { PING_STATES } from '../../../../reducers/comms/ping/index';

export default function OAuthAndTest({
  resourceType,
  resourceId,
  onCancel,
  formKey,
  flowId,
  integrationId,
  parentType,
  parentId,
}) {
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, getAsyncKey(resourceType, resourceId))
  );
  const testConnectionCommState = useSelector(state =>
    selectors.testConnectionCommState(state, resourceId)
  );
  const pingLoading = testConnectionCommState.commState === PING_STATES.LOADING;

  const parentContext = useMemo(() => ({
    flowId,
    integrationId,
    parentType,
    parentId,
  }), [flowId, integrationId, parentId, parentType]);

  const handleSave = useHandleSaveAndAuth({formKey, resourceType, resourceId, parentContext});
  const disabled = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  return (
    <>
      <SaveAndCloseMiniResourceForm
        formKey={formKey}
        disabled={pingLoading}
        submitTransientLabel="Authorizing..."
        submitButtonLabel="Save & authorize"
        formSaveStatus={formSaveStatus}
        handleSave={handleSave}
        handleCancel={onCancel}
      />
      <TestButton
        disabled={disabled}
        resourceId={resourceId}
        formKey={formKey}
      />
    </>
  );
}
