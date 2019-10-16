import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function OAuthButton(props) {
  const { label, classes, resourceType, disabled, ...rest } = props;
  const [disableSave, setDisableSave] = useState(false);
  const { resourceId } = rest;
  const dispatch = useDispatch();
  const handleSaveAndAuthorizeConnection = values => {
    dispatch(actions.resource.connections.saveAndAuthorize(resourceId, values));
    setDisableSave(true);
  };

  window.connectionAuthorized = _connectionId => {
    dispatch(actions.resource.connections.authorized(_connectionId));
  };

  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  useEffect(() => {
    if (formState.submitComplete) setDisableSave(false);
  }, [formState.submitComplete]);

  return (
    <DynaAction
      {...rest}
      disabled={disabled || disableSave}
      className={classes.actionButton}
      onClick={handleSaveAndAuthorizeConnection}>
      {disableSave ? 'Authorizing' : label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default withStyles(styles)(OAuthButton);
