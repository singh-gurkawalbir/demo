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
    match,
  } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    let type = resourceType;

    if (resourceType === 'connectorLicenses') {
      // construct url for licenses
      const connectorUrlStr = '/connectors/';
      const startIndex =
        match.url.indexOf(connectorUrlStr) + connectorUrlStr.length;

      if (startIndex !== -1) {
        const connectorId = match.url.substring(
          startIndex,
          match.url.indexOf('/', startIndex)
        );

        type = `connectors/${connectorId}/licenses`;
      }
    }

    dispatch(actions.resourceForm.submit(type, resourceId, values));
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
