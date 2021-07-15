import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { getAsyncKey } from '../../../../sagas/resourceForm';
import { CLOSE_AFTER_SAVE } from '../../../SaveAndCloseButtonGroup';
import useHandleCancel from '../../../SaveAndCloseButtonGroup/hooks/useHandleCancel';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
import useHandleClickWhenValid from './hooks/useHandleClickWhenValid';
import TestButton from './TestAndSave/TestButton';

export default function SaveAndContinueGroup(props) {
  const {
    // we are removing this label let it change per button Group
    // submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    onCancel,
    formKey,
  } = props;

  const match = useRouteMatch();

  const dispatch = useDispatch();
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, getAsyncKey(resourceType, resourceId))
  );
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const handleSaveAndContinue = useCallback(
    closeAfterSave => {
      const newValues = {...values};

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }

      dispatch(
        actions.resourceForm.saveAndContinue(
          resourceType,
          resourceId,
          newValues,
          match,
          !closeAfterSave
        )
      );
    },
    [dispatch, match, resourceId, resourceType, values]
  );
  const onSave = useHandleClickWhenValid(formKey, handleSaveAndContinue);

  const handleCloseAfterSave = useCallback(() => {
    handleSaveAndContinue(CLOSE_AFTER_SAVE);
  }, [handleSaveAndContinue]);
  const handleCancelClick = useHandleCancel({
    formKey, onClose: onCancel, handleSave: handleCloseAfterSave,
  });

  return (
    <>
      <SaveAndCloseMiniResourceForm
        formKey={formKey}
        submitButtonLabel="Save & continue"
        submitTransientLabel="Saving..."
        formSaveStatus={formSaveStatus}
        handleSave={onSave}
        handleCancelClick={handleCancelClick}
  />
      <TestButton
        resourceId={resourceId}
        formKey={formKey}
      />
    </>
  );
}
