import { withStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const SaveFileDefinitionButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    classes,
  } = props;
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const handleSubmitForm = values => {
    let definitionRules = values['/file/filedefinition/rules'];

    try {
      definitionRules = JSON.parse(definitionRules);

      dispatch(
        actions.fileDefinitions.definition.userDefined.save(definitionRules, {
          resourceId,
          resourceType,
          values,
        })
      );
    } catch (e) {
      // Handle incase of JSON parsing error
      enquesnackbar({
        message: e,
        variant: 'error',
      });
    }
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

export default withStyles(styles)(SaveFileDefinitionButton);
