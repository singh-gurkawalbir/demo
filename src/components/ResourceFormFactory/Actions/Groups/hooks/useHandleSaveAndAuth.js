
import { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import resourceConstants from '../../../../../forms/constants/connection';
import actions from '../../../../../actions';
import { useSelectorMemo } from '../../../../../hooks';
import { selectors } from '../../../../../reducers';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { emptyObject } from '../../../../../utils/constants';
import { useLoadIClientOnce } from '../../../../DynaForm/fields/DynaIclient';
import useHandleClickWhenValid from './useHandleClickWhenValid';

export default function useHandleSaveAndAuth({formKey, resourceType, resourceId}) {
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

  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const saveAndAuthorizeWhenScopesArePresent = useCallback(
    () => {
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

      handleSaveAndAuthorizeConnection(values);
    },
    [handleSaveAndAuthorizeConnection, resource._connectorId, resource.assistant, snackbar, values]
  );

  return useHandleClickWhenValid(
    formKey,
    saveAndAuthorizeWhenScopesArePresent,
  );
}
