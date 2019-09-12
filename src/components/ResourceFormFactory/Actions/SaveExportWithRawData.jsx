import { withStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const SaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    classes,
  } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    // Dispatches an action that uploads RawData to S3 and updates 'rawData' field with S3 'runkey'
    // Then saves form
    dispatch(
      actions.resourceForm.submitWithRawData(resourceType, resourceId, values)
    );
  };

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      onClick={handleSubmitForm}>
      {submitButtonLabel}
    </DynaAction>
  );
};

export default withStyles(styles)(SaveButton);
