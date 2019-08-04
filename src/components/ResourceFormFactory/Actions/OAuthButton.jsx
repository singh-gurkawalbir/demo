import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const mapDispatchToProps = (dispatch, { resourceId }) => ({
  handleSaveAndAuthorizeConnection: values => {
    dispatch(actions.resource.connections.saveAndAuthorize(resourceId, values));
  },
});

function OAuthButton(props) {
  const { handleSaveAndAuthorizeConnection, label, classes, ...rest } = props;
  // action id

  return (
    <DynaAction
      {...rest}
      className={classes.actionButton}
      onClick={handleSaveAndAuthorizeConnection}>
      {label || 'Save & Authorize'}
    </DynaAction>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(OAuthButton));
