import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import { selectors } from '../../../reducers';
import resourceConstants from '../../../forms/constants/connection';
import { useLoadingSnackbarOnSave } from '.';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { useLoadIClientOnce } from '../../DynaForm/fields/DynaIclient';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../utils/constants';

export default function OAuthButton(props) {
  const { label, resourceType, disabled, resourceId, ...rest } = props;
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  )?.merged || emptyObject;
  const [snackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const { iClients } = useLoadIClientOnce({
    connectionId: resource._id || resourceId,
    disableLoad:
      !resource._connectorId ||
      !(
        ['shopify', 'squareup', 'hubspot'].includes(resource.assistant) ||
        (resource.type === 'salesforce' && resource.newIA)
      ),
  });
  const handleSaveAndAuthorizeConnection = useCallback(
    values => {
      const newValues = { ...values };

      if (
        resource._connectorId &&
        ((['shopify', 'hubspot'].includes(resource.assistant) &&
        values['/http/auth/type'] === 'oauth') || resource.assistant === 'squareup')
      ) {
        newValues['/http/_iClientId'] =
          iClients && iClients[0] && iClients[0]._id;
      } else if (
        resource._connectorId && resource.newIA &&
        resource.type === 'salesforce'
      ) {
        newValues['/salesforce/_iClientId'] =
          iClients && iClients[0] && iClients[0]._id;
      }
      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }

      dispatch(
        actions.resource.connections.saveAndAuthorize(resourceId, newValues)
      );
    },
    [
      dispatch,
      iClients,
      resource._connectorId,
      resource.assistant,
      resource.type,
      resource.newIA,
      resourceId,
    ]
  );

  window.connectionAuthorized = _connectionId => {
    dispatch(actions.resource.connections.authorized(_connectionId));
  };

  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const { handleSubmitForm, isSaving } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave: handleSaveAndAuthorizeConnection,
    resourceType,
  });
  const saveAndAuthorizeWhenScopesArePresent = useCallback(
    values => {
      if (
        resourceConstants.OAUTH_CONNECTIONS_WITH_EDITABLE_SCOPES.includes(
          resource.assistant
        )
      ) {
        let showError = false;

        if (
          resource._connectorId &&
         ['shopify', 'squareup', 'hubspot'].includes(resource.assistant) &&
          values['/http/auth/type'] === 'oauth'
        ) {
          showError = false;
        } else if (resource.assistant === 'ebay') {
          if (values['/accountType'] === 'sandbox') {
            if (
              !(
                values['/http/scopeSandbox'] &&
                values['/http/scopeSandbox'].length
              )
            ) {
              showError = true;
            }
          } else if (
            !(
              values['/http/scopeProduction'] &&
              values['/http/scopeProduction'].length
            )
          ) {
            showError = true;
          }
        } else if (
          !(
            values['/http/auth/oauth/scope'] &&
            values['/http/auth/oauth/scope'].length
          )
        ) {
          showError = true;
        }

        if (showError) {
          return snackbar({
            variant: 'error',
            message: 'Please configure the scopes.',
            persist: true,
          });
        }
      }

      handleSubmitForm(values);
    },
    [handleSubmitForm, resource._connectorId, resource.assistant, snackbar]
  );

  return (
    <DynaAction
      {...rest}
      resourceType={resourceType}
      disabled={disabled || isSaving}
      ignoreFormTouchedCheck
      onClick={saveAndAuthorizeWhenScopesArePresent}>
      {isSaving ? 'Authorizing' : label || 'Save & authorize'}
    </DynaAction>
  );
}

