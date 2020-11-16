import { withStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import { selectors } from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';
import useConfirmDialog from '../../ConfirmDialog';

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
    disabled = false,
    isGenerate = false,
    skipCloseOnSave = false,
    flowId,
    disableSaveOnClick,
    submitButtonColor = 'secondary',
    setDisableSaveOnClick,
  } = props;
  const { confirmDialog } = useConfirmDialog();

  const match = useRouteMatch();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const onCancel = useCallback(() => {
    setDisableSaveOnClick(false);
  }, [setDisableSaveOnClick]);
  const saveResource = useCallback(
    values => {
      const newValues = { ...values };

      if (!newValues['/_borrowConcurrencyFromConnectionId']) {
        newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
      }
      dispatch(
        actions.resourceForm.submit(
          resourceType,
          resourceId,
          newValues,
          match,
          skipCloseOnSave,
          isGenerate,
          flowId
        )
      );
    }, [dispatch, flowId, isGenerate, match, resourceId, resourceType, skipCloseOnSave]);
  const onSave = useCallback(
    values => {
      if (resource?._connectionId && values['/_connectionId'] && resource._connectionId !== values['/_connectionId']) {
        confirmDialog({
          title: 'Confirm replace',
          message: 'Are you sure you want to replace the connection for this flow step? Replacing a connection will cancel all jobs currently running for this flow.',
          onDialogClose: onCancel,
          buttons: [
            {
              label: 'Replace',
              onClick: () => {
                saveResource(values);
              },
            },
            {
              label: 'Cancel',
              color: 'secondary',
              onClick: onCancel,
            },
          ],
        });
      } else { saveResource(values); }
    },
    [confirmDialog, onCancel, resource?._connectionId, saveResource]
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

export default withStyles(styles)(SaveButton);
