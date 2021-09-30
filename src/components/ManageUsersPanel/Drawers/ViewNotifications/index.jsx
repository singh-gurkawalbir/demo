import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import RightDrawer from '../../../drawer/Right';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import { selectors } from '../../../../reducers';
import viewNotificationsMetadata from './metadata';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useGetNotificationOptions from '../../../../hooks/useGetNotificationOptions';
import DynaForm from '../../../DynaForm';
import LoadResources from '../../../LoadResources';

function ViewNotifications({ integrationId, childId, onClose }) {
  const match = useRouteMatch();
  const [count, setCount] = useState(0);
  const { userEmail } = match.params;
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const notifications = useSelector(state => {
    if (!integrationId) {
      return selectors.subscribedNotifications(state, userEmail);
    }

    return selectors.integrationNotificationResources(state, integrationId, { childId, userEmail});
  },
  shallowEqual
  );

  const { flowValues = [], connectionValues = [], connections, flows } = notifications;

  const flowHash = flowValues.sort().join('');
  const connHash = connectionValues.sort().join('');

  const isValidUserEmail = !!users.find(user => user.sharedWithUser.email === userEmail);

  if (!isValidUserEmail) {
    onClose();
  }

  const { flowOps, connectionOps } = useGetNotificationOptions({ integrationId, flows, connections });

  const fieldMeta = viewNotificationsMetadata({
    connectionValues,
    connectionOps,
    flowValues,
    flowOps,
    integrationId,
  });

  const formKey = useFormInitWithPermissions({
    fieldMeta,
    remount: count,
    disabled: true,
  });

  useEffect(() => {
    setCount(count => count + 1);
  }, [flowHash, connHash]);

  return (
    <LoadResources required resources="notifications,flows,connections">
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
    </LoadResources>
  );
}

export default function ViewNotificationsDrawer({ integrationId, childId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path=":userEmail/notifications"
      variant="temporary"
      width="medium">
      <DrawerHeader title="View notifications" />
      <ViewNotifications integrationId={integrationId} childId={childId} onClose={handleClose} />
    </RightDrawer>
  );
}
