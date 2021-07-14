import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import useHandleClickWhenValid from '../../../../ResourceFormFactory/Actions/Groups/hooks/useHandleClickWhenValid';
import SaveAndCloseButtonGroup from '../../../../SaveAndCloseButtonGroup';

export default function SaveAndClose(props) {
  const {
    resourceType,
    resourceId,
    disabled = false,
    ssLinkedConnectionId,
    onCancel,
    formKey,
    integrationId,
  } = props;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const formSaveStatus = useSelector(state =>
    selectors.suiteScriptResourceFormState(state, {
      resourceType,
      resourceId,
      ssLinkedConnectionId,
      integrationId,
    })?.formSaveStatus
  );

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const isDirty = useSelector(state => selectors.isFormDirty(state, formKey));

  const onSave = useCallback(
    closeAfterSave => {
      dispatch(
        actions.suiteScript.resourceForm.submit(
          ssLinkedConnectionId,
          integrationId,
          resourceType,
          resourceId,
          values,
          match,
          !closeAfterSave,
        )
      );
    },
    [dispatch, integrationId, match, resourceId, resourceType, ssLinkedConnectionId, values]
  );
  const handleSubmitForm = useHandleClickWhenValid(formKey, onSave);

  // TODO: @Surya Do we need to pass all props to DynaAction?
  // Please revisit after form refactor

  return (
    <SaveAndCloseButtonGroup
      disableOnCloseAfterSave
      disabled={disabled}
      isDirty={isDirty}
      status={formSaveStatus}
      onClose={onCancel}
      onSave={handleSubmitForm}
  />
  );
}

