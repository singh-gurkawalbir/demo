import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function IntegrationSettingsSaveButton(props) {
  const classes = useStyles();
  const {
    submitButtonLabel = 'Save',
    integrationId,
    storeId,
    flowId,
    disabled,
  } = props;
  const dispatch = useDispatch();
  const [disableSave, setDisableSave] = useState(false);
  const handleSubmitForm = values => {
    dispatch(
      actions.integrationApp.settings.update(
        integrationId,
        flowId,
        storeId,
        values
      )
    );
    setDisableSave(true);
  };

  const formState = useSelector(state => {
    const {
      submitComplete,
      submitFailed,
    } = selectors.integrationAppSettingsFormState(state, integrationId, flowId);

    return {
      submitCompleted: submitComplete || submitFailed,
    };
  });

  useEffect(() => {
    if (formState.submitCompleted) {
      setDisableSave(false);
    }
  }, [formState.submitCompleted]);

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {disableSave ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
}
