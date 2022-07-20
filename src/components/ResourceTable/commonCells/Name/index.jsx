import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../../constants/resource';
import { selectors } from '../../../../reducers';
import {
  STANDALONE_INTEGRATION,
} from '../../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import getRoutePath from '../../../../utils/routePaths';

export default function NameCell({al, actionProps}) {
  const resourceType = RESOURCE_TYPE_SINGULAR_TO_PLURAL[al.resourceType];
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

    return selectors.resource(state, resourceType, al._resourceId)?.name;
  });
  const routePath = useSelector(state => {
    if (resourceType === 'revisions') {
      const { integrationId } = actionProps;
      const viewRevisionDetailsDrawerUrl = buildDrawerUrl({
        path: drawerPaths.LCM.VIEW_REVISION_DETAILS,
        baseUrl: getRoutePath(`integrations/${integrationId}/revisions`),
        params: { revisionId: al._resourceId, mode: 'details'},
      });

      return viewRevisionDetailsDrawerUrl;
    }

    return selectors.getResourceEditUrl(state, resourceType, al._resourceId, actionProps?.childId, al.sectionId);
  });

  if (resourceType === 'integrations' && al?._resourceId === 'none') {
    resourceName = STANDALONE_INTEGRATION.name;
  }

  if (al.event === 'delete') {
    if (!al.deletedInfo) {
      return al._resourceId || '';
    }

    return al.deletedInfo.name || '';
  }

  if (resourceType === 'users') {
    return resourceName || al._resourceId;
  }

  return (
    <Link
      onClick={actionProps && actionProps.onClick}
      to={routePath}>
      {resourceName || al._resourceId}
    </Link>
  );
}
