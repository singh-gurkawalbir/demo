import { withStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../../actions';
import DynaAction from '../../../DynaForm/DynaAction';
import * as selectors from '../../../../reducers';
import { useLoadingSnackbarOnSave } from '.';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});


const SuiteSciptSaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    classes,
    disabled = false,
    sectionId,
    ssLinkedConnectionId,
    integrationId,
  } = props;
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

export default withStyles(styles)(SuiteSciptSaveButton);
