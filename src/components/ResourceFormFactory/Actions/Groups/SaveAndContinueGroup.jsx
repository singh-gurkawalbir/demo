import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import useHandleClickWhenValid from './hooks/useHandleClickWhenValid';
import { NextAndCancelButtonGroup } from './NextAndCancel';
import TestButton from './TestAndSave/TestButton';

export default function SaveAndContinueGroup(props) {
  const {
    // we are removing this label let it change per button Group
    // submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
    onCancel,
    formKey,
  } = props;

  const match = useRouteMatch();

  const dispatch = useDispatch();
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, `${resourceType}-${resourceId}`)
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
          match
        )
      );
    },
    [dispatch, match, resourceId, resourceType, values]
  );
  const onSave = useHandleClickWhenValid(formKey, handleSaveAndContinue);
  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  return (
    <>
      <NextAndCancelButtonGroup
        disabled={disabled}
        isDirty={isDirty}
        submitButtonLabel="Save & continue"
        submitTransientLabel="Saving..."
        formSaveStatus={formSaveStatus}
        handleSave={onSave}
        handleCancelClick={onCancel}
  />
      <TestButton
        resourceId={resourceId}
        formKey={formKey}
      />
    </>
  );
}
