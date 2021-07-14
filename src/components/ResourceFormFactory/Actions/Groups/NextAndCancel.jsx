import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';
import ActionGroup from '../../../ActionGroup';
import useHandleCancel from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancel';
import Spinner from '../../../Spinner';
import useHandleSubmit from './hooks/useHandleSubmit';

export function NextAndCancelButtonGroup({
  isDirty,
  submitButtonLabel = '',
  submitTransientLabel = '',
  formSaveStatus,
  handleSave,
  handleCancelClick,
}) {
  const inProgress = formSaveStatus === FORM_SAVE_STATUS.LOADING;

  return (
    <ActionGroup>
      <Button
        variant="outlined"
        data-test="next"
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
        onClick={handleCancelClick}>
        Cancel
      </Button>
    </ActionGroup>
  );
}

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
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

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
    isDirty, onClose: onCancel, handleSave: handleCloseAfterSave,

  });

  return (
    <NextAndCancelButtonGroup
      submitTransientLabel="Saving..."
      submitButtonLabel={submitButtonLabel}
      isDirty={isDirty}
      formSaveStatus={formSaveStatus}
      handleSave={handleSave}
      handleCancelClick={handleCancelClick}

    />
  );
}
