import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { getAsyncKey } from '../../../../sagas/resourceForm';
import SaveAndCloseMiniResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseMiniResourceForm';
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
    () => {
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
          false
        )
      );
    },
    [dispatch, match, resourceId, resourceType, values]
  );

  return (
    <>
      <SaveAndCloseMiniResourceForm
        formKey={formKey}
        submitButtonLabel="Save & continue"
        submitTransientLabel="Saving..."
        formSaveStatus={formSaveStatus}
        handleSave={handleSaveAndContinue}
        handleCancel={onCancel}
  />
      <TestButton
        resourceId={resourceId}
        formKey={formKey}
      />
    </>
  );
}
