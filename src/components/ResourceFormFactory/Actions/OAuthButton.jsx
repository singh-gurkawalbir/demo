import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';
import resourceConstants from '../../../forms/constants/connection';
import { useLoadingSnackbarOnSave } from '.';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function OAuthButton(props) {
  const {
    label,
    classes,
    resourceType,
    disabled,
    resource,
    assistant,
    ...rest
  } = props;
  const { resourceId } = rest;
  const [snackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const iClients = (resource && resource.iClients) || [];
  const [requested, setRequested] = useState(false);
  let integrationDoc;

  if (resource && resource.newIA) {
    integrationDoc = {
      id: resource._integrationId,
      connectionType: resource.type,
      assistant: resource.assistant,
    };
  }

  useEffect(() => {
    if (
      !iClients.length &&
      resource._connectorId &&
      (resource.assistant === 'shopify' || resource.assistant === 'squareup') &&
      !requested
    ) {
      setRequested(true);
      dispatch(
        actions.resource.connections.requestIClients(
          resource._id,
          integrationDoc
        )
      );
    }
  }, [
    dispatch,
    iClients.length,
    integrationDoc,
    requested,
    resource._connectorId,
    resource._id,
    resource.assistant,
    resource.type,
    resourceType,
  ]);
  const handleSaveAndAuthorizeConnection = useCallback(
    values => {
      const newValues = { ...values };

      if (
        resource._connectorId &&
        (resource.assistant === 'shopify' ||
          resource.assistant === 'squareup') &&
        values['/http/auth/type'] === 'oauth'
      ) {
        newValues['/http/_iClientId'] =
          iClients && iClients[0] && iClients[0]._id;
      }

      dispatch(
        actions.resource.connections.saveAndAuthorize(resourceId, newValues)
      );
    },
    [dispatch, iClients, resource._connectorId, resource.assistant, resourceId]
  );

  window.connectionAuthorized = _connectionId => {
    dispatch(actions.resource.connections.authorized(_connectionId));
  };

  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
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
          (resource.assistant === 'shopify' ||
            resource.assistant === 'squareup') &&
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
            message: `Please configure the scopes.`,
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
      disabled={disabled || disableSave}
      className={classes.actionButton}
      ignoreFormTouchedCheck
      onClick={saveAndAuthorizeWhenScopesArePresent}>
      {disableSave ? 'Authorizing' : label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default withStyles(styles)(OAuthButton);
