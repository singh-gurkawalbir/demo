import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';

const mapDispatchToProps = dispatch => ({
  handleSubmitForm: (resourceType, resourceId) => values => {
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  },
});
const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const SaveButton = props => {
  const {
    label = 'Submit',
    handleSubmitForm,
    resourceType,
    resourceId,
    classes,
  } = props;

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      onClick={handleSubmitForm(resourceType, resourceId)}>
      {label || 'Save'}
    </DynaAction>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(SaveButton));
