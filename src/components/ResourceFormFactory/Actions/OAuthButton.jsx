import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});

function OAuthButton(props) {
  const { label, classes, ...rest } = props;
  // action id
  const { resourceId } = rest;
  const dispatch = useDispatch();
  const handleSaveAndAuthorizeConnection = values =>
    dispatch(actions.resource.connections.saveAndAuthorize(resourceId, values));

  window.connectionAuthorized = _connectionId => {
    dispatch(actions.resource.connections.authorized(_connectionId));
  };

  return (
    <DynaAction
      {...rest}
      className={classes.actionButton}
      onClick={handleSaveAndAuthorizeConnection}>
      {label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default withStyles(styles)(OAuthButton);
