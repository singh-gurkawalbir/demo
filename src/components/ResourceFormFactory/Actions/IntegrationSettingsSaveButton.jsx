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
const IntegrationSettingsSaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    integrationId,
    storeId,
    classes,
  } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    dispatch(
      actions.integrationApp.settings.update(integrationId, storeId, values)
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

export default withStyles(styles)(IntegrationSettingsSaveButton);
