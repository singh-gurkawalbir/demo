import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import ShowContentIcon from '../../../../icons/ShowContentIcon';
import EditIcon from '../../../../icons/EditIcon';
import AddIcon from '../../../../icons/AddIcon';

export default function Notifications({ user, integrationId, childId }) {
  const match = useRouteMatch();
  const userEmail = user.sharedWithUser?.email;
  const canManageNotifications = useSelector(state => {
    const hasManageIntegrationAccess = selectors.hasManageIntegrationAccess(state, integrationId);
    const isActiveUser = !user.disabled && user.accepted;
    const loggedInUserId = selectors.userProfile(state)?._id;
    const isLoggedInUser = loggedInUserId === user.sharedWithUser?._id;

    return isLoggedInUser || (isActiveUser && hasManageIntegrationAccess);
  });

  const hasNotifications = useSelector(state => {
    if (!integrationId) return false;
    const { flowValues = [], connectionValues = [] } = selectors.integrationNotificationResources(state, integrationId, { childId, userEmail});

    return flowValues.length || connectionValues.length;
  });

  if (!canManageNotifications) {
    return <Link to={`${match.url}/${userEmail}/notifications`}><ShowContentIcon /></Link>;
  }

  if (hasNotifications) {
    return <Link to={`${match.url}/${userEmail}/manageNotifications`}><EditIcon /></Link>;
  }

  return <Link to={`${match.url}/${userEmail}/manageNotifications`}><AddIcon /></Link>;
}
