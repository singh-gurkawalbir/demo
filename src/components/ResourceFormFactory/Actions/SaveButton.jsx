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
  const { label = 'Submit', resourceType, resourceId, classes } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = (resourceType, resourceId) => values => {
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  };

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      onClick={handleSubmitForm(resourceType, resourceId)}>
      {label || 'Save'}
    </DynaAction>
  );
};

export default withStyles(styles)(SaveButton);
