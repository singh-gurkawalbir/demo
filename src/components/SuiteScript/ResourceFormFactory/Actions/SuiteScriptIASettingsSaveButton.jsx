import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoadingSnackbarOnSave } from '.';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import DynaAction from '../../../DynaForm/DynaAction';


const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

const SuiteScriptIASettingsSaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    disabled = false,
    sectionId,
    ssLinkedConnectionId,
    integrationId,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.suiteScriptIAFormSaveProcessTerminated(state, {
      ssLinkedConnectionId,
      integrationId,
    })
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId, sectionId, values)
      );
    },
    [dispatch, integrationId, sectionId, ssLinkedConnectionId]
  );
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
  });

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {disableSave ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default SuiteScriptIASettingsSaveButton;
