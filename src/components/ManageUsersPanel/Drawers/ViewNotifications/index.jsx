import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import RightDrawer from '../../../drawer/Right';
import { selectors } from '../../../../reducers';

function ViewNotifications({ integrationId, storeId, onClose }) {
  const match = useRouteMatch();
  const { userEmail } = match.params;
  const users = useSelector(state => selectors.availableUsersList(state, integrationId));
  const notifications = useSelector(state => {
    if (!integrationId) {
      return selectors.subscribedNotifications(state, userEmail);
    }

    return selectors.integrationNotificationResources(state, integrationId, { storeId, userEmail});
  },
  shallowEqual
  );

  const { flowValues = [], connectionValues = [] } = notifications;

  const isValidUserEmail = !!users.find(user => user.sharedWithUser.email === userEmail);

  if (!isValidUserEmail) {
    onClose();
  }

  return <div> {flowValues.length} Flows and {connectionValues.length} connections </div>;
}

export default function ViewNotificationsDrawer({ integrationId, storeId }) {
  const match = useRouteMatch();
  const history = useHistory();
  const handleClose = useCallback(() => history.replace(`${match.url}`), [history, match]);

  return (
    <RightDrawer
      path=":userEmail/notifications"
      title="View notifications"
      variant="temporary"
      width="medium"
      hideBackButton>
      <ViewNotifications integrationId={integrationId} storeId={storeId} onClose={handleClose} />
    </RightDrawer>
  );
}
