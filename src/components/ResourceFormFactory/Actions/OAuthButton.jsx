import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';
import resourceConstants from '../../../forms/constants/connection';
import { useLoadingSnackbarOnSave } from '.';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function OAuthButton(props) {
  const { label, classes, resourceType, disabled, resource, ...rest } = props;
  const { resourceId } = rest;
  const dispatch = useDispatch();
  const handleSaveAndAuthorizeConnection = useCallback(
    (values, setDisableSave, snackbar, closeSnackbar) => {
      if (
        resourceConstants.OAUTH_CONNECTIONS_WITH_EDITABLE_SCOPES.includes(
          resource.assistant
        ) &&
        !(
          values['/http/auth/oauth/scope'] &&
          values['/http/auth/oauth/scope'].length
        )
      ) {
        setDisableSave(false);
        closeSnackbar();

        return snackbar({
          variant: 'error',
          message: `Please configure the scopes.`,
          persist: true,
        });
      }

      dispatch(
        actions.resource.connections.saveAndAuthorize(resourceId, values)
      );
    },
    [dispatch, resource.assistant, resourceId]
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

  return (
    <DynaAction
      {...rest}
      disabled={disabled || disableSave}
      className={classes.actionButton}
      onClick={handleSubmitForm}>
      {disableSave ? 'Authorizing' : label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default withStyles(styles)(OAuthButton);
