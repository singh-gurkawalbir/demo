import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL, RESOURCE_TYPES_WITHOUT_CREATE_EDIT_PAGE } from '../../../../constants/resource';
import { selectors } from '../../../../reducers';
import {
  STANDALONE_INTEGRATION,
} from '../../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import getRoutePath from '../../../../utils/routePaths';
import { getNotificationResourceType } from '../../../../utils/resource';

export default function NameCell({al, actionProps}) {
  const resourceType = RESOURCE_TYPE_SINGULAR_TO_PLURAL[al.resourceType];
  const notificationResourceType = resourceType === 'notifications' ? getNotificationResourceType(al) : '';

  let resourceName = useSelector(state => {
    if (resourceType === 'revisions') {
      const { integrationId } = actionProps;

      return selectors.revision(state, integrationId, al._resourceId)?.description;
    }
    if (resourceType === 'users') {
      const { integrationId } = actionProps;
      const user = selectors.availableUsersList(state, integrationId)?.find(user => user.sharedWithUser?._id === al._resourceId);

      return user?.sharedWithUser?.name || user?.sharedWithUser?.email;
    }

    return selectors.resource(state, resourceType === 'notifications' ? notificationResourceType : resourceType, al._resourceId)?.name;
  });
  const routePath = useSelector(state => {
    if (resourceType === 'revisions') {
      const { integrationId } = actionProps;

      if (!integrationId) return;
      const viewRevisionDetailsDrawerUrl = buildDrawerUrl({
        path: drawerPaths.LCM.VIEW_REVISION_DETAILS,
        baseUrl: getRoutePath(`integrations/${integrationId}/revisions`),
        params: { revisionId: al._resourceId, mode: 'details'},
      });

      return viewRevisionDetailsDrawerUrl;
    }

    return selectors.getResourceEditUrl(state, resourceType === 'notifications' ? notificationResourceType : resourceType, al._resourceId, actionProps?.childId, al.sectionId);
  });

  if (resourceType === 'integrations' && al?._resourceId === 'none') {
    resourceName = STANDALONE_INTEGRATION.name;
  }

  if (al.event === 'delete') {
    if (!al.deletedInfo) {
      return al._resourceId || '';
    }

    return resourceName || al._resourceId || '';
  }

  if (!routePath || RESOURCE_TYPES_WITHOUT_CREATE_EDIT_PAGE.includes(resourceType)) {
    return resourceName || al._resourceId || '';
  }

  return (
    <Link
      onClick={actionProps && actionProps.onClick}
      to={routePath}>
      {resourceName || al._resourceId}
    </Link>
  );
}
