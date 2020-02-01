import { useCallback } from 'react';
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
  const { label, classes, resourceType, disabled, resource, ...rest } = props;
  const { resourceId } = rest;
  const [snackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const handleSaveAndAuthorizeConnection = useCallback(
    values => {
      dispatch(
        actions.resource.connections.saveAndAuthorize(resourceId, values)
      );
    },
    [dispatch, resourceId]
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
        ) &&
        !(
          values['/http/auth/oauth/scope'] &&
          values['/http/auth/oauth/scope'].length
        )
      ) {
        return snackbar({
          variant: 'error',
          message: `Please configure the scopes.`,
          persist: true,
        });
      }

      handleSubmitForm(values);
    },
    [handleSubmitForm, resource.assistant, snackbar]
  );

  return (
    <DynaAction
      {...rest}
      disabled={disabled || disableSave}
      className={classes.actionButton}
      onClick={saveAndAuthorizeWhenScopesArePresent}>
      {disableSave ? 'Authorizing' : label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default withStyles(styles)(OAuthButton);
