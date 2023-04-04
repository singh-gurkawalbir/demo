import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import ActionGroup from '../../../../ActionGroup';
import useHandleSubmit from '../hooks/useHandleSubmit';
import { selectors } from '../../../../../reducers';
import { FORM_SAVE_STATUS, DISCARD_DIALOG_TITLE, DISCARD_DIALOG_MESSAGE } from '../../../../../constants';
import useHandleClickWhenValid from '../hooks/useHandleClickWhenValid';
import useClearAsyncStateOnUnmount from '../../../../SaveAndCloseButtonGroup/hooks/useClearAsyncStateOnUnmount';
import useConfirmDialog from '../../../../ConfirmDialog';
import useTriggerCancelFromContext from '../../../../SaveAndCloseButtonGroup/hooks/useTriggerCancelFromContext';
import { FilledButton, OutlinedButton, TextButton } from '../../../../Buttons';
import getRoutePath from '../../../../../utils/routePaths';
import { generateNewId } from '../../../../../utils/resource';

function useHandleCancelIntegration({ formKey, onClose, handleSave}) {
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));
  const { confirmDialog } = useConfirmDialog();

  const saveChangesAndCreateFlow = useCallback(() => {
    handleSave(true);
  }, [handleSave]);
  const saveChangesAndClose = useCallback(() => {
    handleSave();
  }, [handleSave]);

  const handleCancelClick = useCallback(() => {
    if (!isDirty) return onClose();
    confirmDialog({
      title: DISCARD_DIALOG_TITLE,
      message: DISCARD_DIALOG_MESSAGE,
      buttons: [
        { label: 'Save changes & create flow', onClick: saveChangesAndCreateFlow, dataTest: 'saveChangesAndCreateFlow' },
        { label: 'Save changes', onClick: saveChangesAndClose, variant: 'outlined', dataTest: 'saveChangesAndCreateIntegration' },
        { label: 'Discard changes', onClick: onClose, variant: 'text', dataTest: 'close' },
      ],
    });
  }, [isDirty, onClose, saveChangesAndCreateFlow, saveChangesAndClose, confirmDialog]);

  return handleCancelClick;
}

export default function CreateNewIntegration(props) {
  const { resourceId: tempIntegrationId, formKey, onCancel } = props;
  const history = useHistory();
  const [createFlowOnSave, setCreateFlowOnSave] = useState(false);

  const createdIntegrationId = useSelector(state =>
    selectors.createdResourceId(state, tempIntegrationId)
  );

  const createIntegration = useHandleSubmit({
    resourceType: 'integrations',
    resourceId: tempIntegrationId,
    formKey,
  });

  const handleSaveAndCreateFlow = useCallback(
    () => {
      setCreateFlowOnSave(true);
      createIntegration();
    },
    [createIntegration],
  );

  const handleSave = useCallback(() => {
    setCreateFlowOnSave(false);
    createIntegration();
  }, [createIntegration]);

  const handleSaveChanges = useCallback(saveAndCreateFlow => {
    // used in discard dialog to either just save or save and create flow
    if (saveAndCreateFlow) {
      return handleSaveAndCreateFlow();
    }
    handleSave();
  }, [handleSave, handleSaveAndCreateFlow]);

  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const formSaveStatus = useSelector(state =>
    selectors.resourceFormState(state, 'integrations', tempIntegrationId)?.formSaveStatus
  );

  useClearAsyncStateOnUnmount(formKey);
  const inProgress = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  const handleSaveWhenValid = useHandleClickWhenValid(formKey, handleSaveChanges);

  const handleCancelWithWarning = useHandleCancelIntegration({formKey, onClose: onCancel, handleSave: handleSaveWhenValid});

  useTriggerCancelFromContext(formKey, handleCancelWithWarning);

  useEffect(() => {
    if (createdIntegrationId) {
      // when new integration is created, we redirect user to Integration page / New flow inside this integration page
      // Depends on the kind of save button he clicks
      if (createFlowOnSave) {
        history.replace(
          getRoutePath(`/integrations/${createdIntegrationId}/flowBuilder/${generateNewId()}`)
        );
      } else {
        history.replace(
          getRoutePath(`/integrations/${createdIntegrationId}/flows`)
        );
      }
    }
  }, [createdIntegrationId, createFlowOnSave, history]);

  if (!isDirty) {
    return (
      <ActionGroup>
        <FilledButton
          data-test="save"
          disabled
          onClick={handleSave}>
          Save
        </FilledButton>
        <TextButton
          data-test="cancel"
          disabled={inProgress}
          onClick={onCancel}>
          Close
        </TextButton>
      </ActionGroup>
    );
  }

  return (
    <ActionGroup>
      {!inProgress ? (
        <FilledButton
          data-test="saveAndCreateFlow"
          disabled={inProgress}
          onClick={handleSaveAndCreateFlow}>
          Save &amp; create flow
        </FilledButton>
      ) : null}

      <OutlinedButton
        data-test="saveAndClose"
        disabled={inProgress}
        onClick={handleSave}>
        {inProgress ? <Spinner size="small">Saving</Spinner> : 'Save & close'}
      </OutlinedButton>

      <TextButton
        data-test="cancel"
        disabled={inProgress}
        onClick={handleCancelWithWarning}>
        Close
      </TextButton>
    </ActionGroup>
  );
}
