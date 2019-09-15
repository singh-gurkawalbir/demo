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
const SaveFileDefinitionButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    classes,
  } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    let definitionRules = values['/file/filedefinition/rules'];

    try {
      definitionRules = JSON.parse(definitionRules);

      // Dispatches an action that saves file definitions and fetches corresponding id
      // updates the same in form values and saves the form
      if (
        definitionRules &&
        definitionRules.fileDefinition &&
        definitionRules.fileDefinition._id
      ) {
        dispatch(
          actions.fileDefinitions.definition.userSupported.update(
            definitionRules.fileDefinition._id,
            definitionRules.fileDefinition || {},
            { resourceId, resourceType, values }
          )
        );
      } else {
        dispatch(
          actions.fileDefinitions.definition.userSupported.request(
            definitionRules.fileDefinition || {},
            { resourceId, resourceType, values }
          )
        );
      }
    } catch (e) {
      // Handle incase of JSON parsing error
      // console.log(e)
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
