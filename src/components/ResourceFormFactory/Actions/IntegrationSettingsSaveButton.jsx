import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function IntegrationSettingsSaveButton(props) {
  const classes = useStyles();
  const { submitButtonLabel = 'Save', integrationId, storeId, flowId } = props;
  const dispatch = useDispatch();
  const handleSubmitForm = values => {
    dispatch(
      actions.integrationApp.settings.update(
        integrationId,
        flowId,
        storeId,
        values
      )
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
}
