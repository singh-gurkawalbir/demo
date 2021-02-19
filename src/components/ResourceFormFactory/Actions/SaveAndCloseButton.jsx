import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import { selectors } from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';
import useConfirmDialog from '../../ConfirmDialog';
import { isNewId } from '../../../utils/resource';

export default function SaveButton(props) {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
    isGenerate = false,
    skipCloseOnSave = false,
    flowId,
    disableSaveOnClick,
    submitButtonColor = 'secondary',
    setDisableSaveOnClick,
  } = props;
  const { confirmDialog } = useConfirmDialog();
  const flow =
    useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow?._integrationId)
  );

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
      if (!isNewId(resourceId) && ['exports', 'imports'].includes(resourceType) && resource?._connectionId !== values?.['/_connectionId']) {
        confirmDialog({
          title: 'Confirm replace',
          message: 'Are you sure you want to replace the connection for this flow step? Replacing a connection will cancel all jobs currently running for this flow.',
          onDialogClose: onCancel,
          buttons: [
            {
              label: 'Replace',
              onClick: () => {
                if (integration?._id) {
                  const registeredConnections = integration?._registeredConnectionIds || [];

                  if (!(registeredConnections.includes(values?.['/_connectionId']))) {
                    dispatch(actions.connection.completeRegister([values?.['/_connectionId']], integration._id));
                  }
                }

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
    [confirmDialog, dispatch, integration, onCancel, resource?._connectionId, resourceId, resourceType, saveResource]
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
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {(isSaving && disableSave) ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
}

