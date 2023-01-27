import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import rfdc from 'rfdc';
import RightDrawer from '../../../drawer/Right';
import DrawerContent from '../../../drawer/Right/DrawerContent';
import DrawerHeader from '../../../drawer/Right/DrawerHeader';
import { selectors } from '../../../../reducers';
import viewNotificationsMetadata from './metadata';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import useGetNotificationOptions from '../../../../hooks/useGetNotificationOptions';
import DynaForm from '../../../DynaForm';
import LoadResources from '../../../LoadResources';
import { drawerPaths } from '../../../../utils/rightDrawer';

const clone = rfdc({ proto: true });

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

  const flowHash = useMemo(() => clone(flowValues).sort().join(''), [flowValues]);
  const connHash = useMemo(() => clone(connectionValues).sort().join(''), [connectionValues]);

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
    <LoadResources
      required
      integrationId={integrationId}
      resources="notifications,flows,connections"
     >
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
    <RightDrawer path={drawerPaths.ACCOUNT.VIEW_NOTIFICATIONS_SETUP} width="medium">
      <DrawerHeader title="View notifications" />
      <ViewNotifications integrationId={integrationId} childId={childId} onClose={handleClose} />
    </RightDrawer>
  );
}
