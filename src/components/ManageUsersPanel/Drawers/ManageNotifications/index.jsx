import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useSaveStatusIndicator from '../../../../hooks/useSaveStatusIndicator';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import useGetNotificationOptions from '../../../../hooks/useGetNotificationOptions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import DynaForm from '../../../DynaForm';
import DynaSubmit from '../../../DynaForm/DynaSubmit';
import LoadResources from '../../../LoadResources';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';
import ButtonGroup from '../../../ButtonGroup';
import notificationsMetadata from './metadata';

function ManageNotifications({ integrationId, storeId, onClose }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const { userEmail } = match.params;
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const notificationsConfig = useMemo(() => ({ storeId, userEmail, ignoreUnusedConnections: true }), [storeId, userEmail]);
  const notifications = useSelectorMemo(
    selectors.mkIntegrationNotificationResources,
    integrationId,
    notificationsConfig);

  const { flowValues = [], connectionValues = [], flows, connections } = notifications;

  const isValidUserEmail = !!users.find(user => user.sharedWithUser.email === userEmail);

  if (!isValidUserEmail) {
    onClose();
  }

  const { flowOps, connectionOps } = useGetNotificationOptions({ integrationId, flows, connections });

  const fieldMeta = notificationsMetadata({
    connectionValues,
    connectionOps,
    flowValues,
    flowOps,
    integrationId,
  });

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    skipMonitorLevelAccessCheck: true,
  });

  const handleSubmit = useCallback(formVal => {
    setSaveTriggered(true);
    const resourcesToUpdate = {
      subscribedConnections: formVal.connections,
      subscribedFlows: formVal.flows,
    };

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, integrationId, { storeId, userEmail }));
  }, [dispatch, integrationId, storeId, userEmail]);

  const handleNotificationUpdate = useCallback(() => {
    const userName = users.find(user => user.sharedWithUser.email === userEmail).sharedWithUser?.name;

    if (saveTriggered) {
      enquesnackbar({
        message: `Notifications for ${userName || userEmail} were successfully updated`,
        variant: 'success',
      });
      setSaveTriggered(false);
    }
  }, [enquesnackbar, userEmail, users, saveTriggered]);

  const { submitHandler, disableSave, defaultLabels} = useSaveStatusIndicator(
    {
      path: '/notifications',
      method: 'put',
      onSave: handleSubmit,
      onClose,
      onSuccess: handleNotificationUpdate,
    }
  );

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowValues, connectionValues, flows, connections]);

  return (
    <LoadResources required resources="notifications,flows,connections">
      <DrawerContent>
        <DynaForm formKey={formKey} fieldMeta={fieldMeta} />
      </DrawerContent>

      <DrawerFooter>
        <ButtonGroup>
          <DynaSubmit
            formKey={formKey}
            onClick={submitHandler()}
            color="primary"
            data-test="saveFlowSchedule"
            disabled={disableSave}>
            {defaultLabels.saveLabel}
          </DynaSubmit>
          <DynaSubmit
            formKey={formKey}
            onClick={submitHandler(true)}
            color="secondary"
            data-test="saveAndCloseFlowSchedule"
            disabled={disableSave}>
            {defaultLabels.saveAndCloseLabel}
          </DynaSubmit>
          <Button onClick={onClose} variant="text" color="primary">
            Cancel
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </LoadResources>
  );
}

export default function ManageNotificationsDrawer({ integrationId, storeId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path=":userEmail/manageNotifications"
      variant="temporary"
      width="medium"
      hideBackButton>
      <DrawerHeader title="Manage notifications" />
      <ManageNotifications integrationId={integrationId} storeId={storeId} onClose={handleClose} />
    </RightDrawer>
  );
}
