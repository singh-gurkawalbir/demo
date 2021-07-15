import React, { useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import SaveAndCloseResourceForm from '../../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';

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

  // TODO: @Surya Do we need to pass all props to DynaAction?
  // Please revisit after form refactor

  return (
    <SaveAndCloseResourceForm
      disableOnCloseAfterSave
      disabled={disabled}
      formKey={formKey}
      status={formSaveStatus}
      onClose={onCancel}
      onSave={onSave}
  />
  );
}

