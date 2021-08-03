import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import useGetNotificationOptions from '../../../../hooks/useGetNotificationOptions';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import DynaForm from '../../../DynaForm';
import LoadResources from '../../../LoadResources';
import RightDrawer from '../../../drawer/Right';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../drawer/Right/DrawerFooter';
import notificationsMetadata from './metadata';
import SaveAndCloseButtonGroupForm from '../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupForm';
import commKeyGen from '../../../../utils/commKeyGenerator';
import { useFormOnCancel } from '../../../FormOnCancelContext/index';
import { MANAGE_NOTIFICATIONS_FORM_KEY } from '../../../../utils/constants';

function ManageNotifications({ integrationId, childId, onClose }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const { userEmail } = match.params;
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const notificationsConfig = useMemo(() => ({ childId, userEmail, ignoreUnusedConnections: true }), [childId, userEmail]);
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

  useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    skipMonitorLevelAccessCheck: true,
    formKey: MANAGE_NOTIFICATIONS_FORM_KEY,
  });
  const formVal = useSelector(state => selectors.formValueTrimmed(state, MANAGE_NOTIFICATIONS_FORM_KEY), shallowEqual);
  const handleSubmit = useCallback(() => {
    setSaveTriggered(true);
    const resourcesToUpdate = {
      subscribedConnections: formVal?.connections,
      subscribedFlows: formVal?.flows,
    };

    dispatch(actions.resource.notifications.updateTile(resourcesToUpdate, integrationId, { childId, userEmail, asyncKey: MANAGE_NOTIFICATIONS_FORM_KEY }));
  }, [dispatch, integrationId, childId, userEmail, formVal]);

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

  const remountForm = useCallback(() => {
    setCount(count => count + 1);
  }, []);
  const path = '/notifications';
  const method = 'put';
  const commStatus = useSelector(state => selectors.commStatusPerPath(state, path, method));
  const clearCommState = useCallback(() => {
    const key = commKeyGen(path, method);

    dispatch(actions.clearCommByKey(key));
  }, [dispatch, method, path]);

  useEffect(() => {
    // watches for commStatus and updates states
    if (['success', 'error'].includes(commStatus)) {
      clearCommState(); // Once API call is done (success/error), clears the comm state
    }
    if (commStatus === 'success') {
      handleNotificationUpdate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commStatus]);

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowValues, connectionValues, flows, connections]);

  return (
    <LoadResources required resources="notifications,flows,connections">
      <DrawerContent>
        <DynaForm formKey={MANAGE_NOTIFICATIONS_FORM_KEY} />
      </DrawerContent>

      <DrawerFooter>
        <SaveAndCloseButtonGroupForm
          formKey={MANAGE_NOTIFICATIONS_FORM_KEY}
          onSave={handleSubmit}
          onClose={onClose}
          remountAfterSaveFn={remountForm}
          />
      </DrawerFooter>
    </LoadResources>
  );
}

export default function ManageNotificationsDrawer({ integrationId, childId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);
  const {disabled, setCancelTriggered} = useFormOnCancel(MANAGE_NOTIFICATIONS_FORM_KEY);

  return (
    <RightDrawer
      path=":userEmail/manageNotifications"
      variant="temporary"
      width="medium"
      hideBackButton>
      <DrawerHeader disableClose={disabled} handleClose={setCancelTriggered} title="Manage notifications" />
      <ManageNotifications integrationId={integrationId} childId={childId} onClose={handleClose} />
    </RightDrawer>
  );
}
