import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { selectors } from '../../../../../reducers';
import ShowContentIcon from '../../../../icons/ShowContentIcon';
import EditIcon from '../../../../icons/EditIcon';
import AddIcon from '../../../../icons/AddIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

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
    return (
      <Tooltip title="View notifications" placement="bottom">
        <Link
          to={buildDrawerUrl({
            path: drawerPaths.ACCOUNT.VIEW_NOTIFICATIONS_SETUP,
            baseUrl: match.url,
            params: { userEmail },
          })}><ShowContentIcon />
        </Link>
      </Tooltip>
    );
  }

  if (hasNotifications) {
    return (
      <Tooltip title="Edit notifications" placement="bottom">
        <Link
          to={buildDrawerUrl({
            path: drawerPaths.ACCOUNT.MANAGE_NOTIFICATIONS_SETUP,
            baseUrl: match.url,
            params: { userEmail },
          })}><EditIcon />
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Add notifications" placement="bottom">
      <Link
        to={buildDrawerUrl({
          path: drawerPaths.ACCOUNT.MANAGE_NOTIFICATIONS_SETUP,
          baseUrl: match.url,
          params: { userEmail },
        })}><AddIcon />
      </Link>
    </Tooltip>
  );
}
