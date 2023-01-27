import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import rfdc from 'rfdc';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { getAsyncKey } from '../../../../utils/saveAndCloseButtons';
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
    flowId,
    integrationId,
    parentType,
    parentId,
    isHTTPForm,
  } = props;

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const formSaveStatus = useSelector(state =>
    selectors.asyncTaskStatus(state, getAsyncKey(resourceType, resourceId))
  );
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const iClientGrantType = useSelector(state => selectors.resource(state, 'iClients', values?.['/http/_iClientId'])?.oauth2?.grantType);
  const oauthType = values?.['/http/auth/type'];

  const parentContext = useMemo(() => ({
    flowId,
    integrationId,
    parentType,
    parentId,
  }), [flowId, integrationId, parentId, parentType]);

  const handleSaveAndContinue = useCallback(
    () => {
      const newValues = rfdc({ proto: true })(values);

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }

      dispatch(
        actions.resourceForm.saveAndContinue(
          resourceType,
          resourceId,
          newValues,
          match,
          false,
          parentContext
        )
      );
    },
    [dispatch, match, resourceId, resourceType, values, parentContext]
  );

  if (isHTTPForm && (oauthType !== 'oauth' || iClientGrantType !== 'clientcredentials')) {
    return null;
  }

  return (
    <>
      <SaveAndCloseMiniResourceForm
        formKey={formKey}
        submitButtonLabel="Save & continue"
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
