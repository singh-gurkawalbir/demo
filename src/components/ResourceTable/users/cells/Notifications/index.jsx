import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { selectors } from '../../../../../reducers';

export default function Notifications({ user, integrationId, storeId }) {
  const match = useRouteMatch();
  const userEmail = user.sharedWithUser.email;
  const hasNotifications = useSelector(state => {
    if (!integrationId) return false;
    const { flowValues = [], connectionValues = [] } = selectors.integrationNotificationResources(state, integrationId, { storeId, userEmail});

    return flowValues.length || connectionValues.length;
  });

  if (hasNotifications) {
    return <Link to={`${match.url}/${userEmail}/notifications`}>Yes</Link>;
  }

  return 'No';
}
