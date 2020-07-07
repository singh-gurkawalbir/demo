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
const SaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    classes,
    match,
    disabled = false,
    isGenerate = false,
    ssLinkedConnectionId,
    integrationId,
  } = props;
  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.suiteScriptResourceFormSaveProcessTerminated(state, {
      resourceType,
      resourceId,
      ssLinkedConnectionId,
      integrationId,
    })
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.suiteScript.resourceForm.submit(
          ssLinkedConnectionId,
          integrationId,
          resourceType,
          resourceId,
          values,
          match,
          false,
          isGenerate,
        )
      );
    },
    [
      dispatch,
      integrationId,
      isGenerate,
      match,
      resourceId,
      resourceType,
      ssLinkedConnectionId,
    ]
  );
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
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

export default withStyles(styles)(SaveButton);
