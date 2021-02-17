import { makeStyles} from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import DynaAction from '../../../DynaForm/DynaAction';
import { selectors } from '../../../../reducers';
import { useLoadingSnackbarOnSave } from '.';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));
const SaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
    skipCloseOnSave = false,
    disableSaveOnClick,
    submitButtonColor = 'secondary',
    setDisableSaveOnClick,
    ssLinkedConnectionId,
    integrationId,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
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
          skipCloseOnSave,
        )
      );
    },
    [dispatch, integrationId, match, resourceId, resourceType, skipCloseOnSave, ssLinkedConnectionId]
  );
  const { handleSubmitForm, disableSave, isSaving } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
    disableSaveOnClick,
    setDisableSaveOnClick,
  });

  // TODO: @Surya Do we need to pass all props to DynaAction?
  // Please revisit after form refactor
  return (
    <DynaAction
      {...props}
      color={submitButtonColor}
      className={classes.actionButton}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {(isSaving && disableSave) ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default SaveButton;
