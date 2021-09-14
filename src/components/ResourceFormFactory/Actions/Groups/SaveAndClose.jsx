import React, { useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { isNewId } from '../../../../utils/resource';
import useConfirmDialog from '../../../ConfirmDialog';
import { isNestedDrawer } from '../../../drawer/Resource/Panel';
import SaveAndCloseResourceForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseResourceForm';
import useHandleSubmit from './hooks/useHandleSubmit';

export default function SaveAndClose(props) {
  const {
    // we are removing this label let it change per button Group
    // submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
    isGenerate = false,
    onCancel,
    formKey,
    integrationId,
    parentType,
    parentId,
  } = props;

  const location = useLocation();
  // User can edit an existing resource via `Would you like to use an existing transfer?` field, while a creating one.
  // Avoid passing flowId to resource being edited in this case.
  // If flowId is passed, the resource gets linked to the flow.
  const flowId = isNestedDrawer(location.pathname) ? undefined : props.flowId;
  const { confirmDialog } = useConfirmDialog();
  const values = useSelector(state => selectors.formState(state, formKey)?.value, shallowEqual);
  const flow =
      useSelector(state => selectors.resource(state, 'flows', flowId)) || {};
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', flow?._integrationId)
  );

  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );

  const dispatch = useDispatch();
  const formSaveStatus = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)?.formSaveStatus
  );

  const parentContext = useMemo(() => ({
    flowId,
    integrationId,
    parentType,
    parentId,
  }), [flowId, integrationId, parentId, parentType]);

  const saveResource = useHandleSubmit({
    resourceType,
    resourceId,
    isGenerate,
    flowId,
    formKey,
    parentContext,
  });
  const onSave = useCallback(
    closeAfterSave => {
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

                saveResource(closeAfterSave);
              },
            },
            {
              label: 'Cancel',
              color: 'secondary',
              onClick: onCancel,
            },
          ],
        });
      } else { saveResource(closeAfterSave); }
    },
    [confirmDialog, dispatch, integration?._id, integration?._registeredConnectionIds, onCancel, resource?._connectionId, resourceId, resourceType, saveResource, values]
  );

  return (
    <SaveAndCloseResourceForm
      disableOnCloseAfterSave
      formKey={formKey}
      status={formSaveStatus}
      onClose={onCancel}
      onSave={onSave}
      disabled={disabled}
  />
  );
}
