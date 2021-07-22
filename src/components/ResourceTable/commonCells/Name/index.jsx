import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../../constants/resource';
import { selectors } from '../../../../reducers';
import {
  STANDALONE_INTEGRATION,
} from '../../../../utils/constants';

export default function NameCell({al, actionProps}) {
  const resourceType = RESOURCE_TYPE_SINGULAR_TO_PLURAL[al.resourceType];
  let resourceName = useSelector(state =>
    selectors.resource(state, resourceType, al._resourceId)?.name
  );
  const routePath = useSelector(state =>
    selectors.getResourceEditUrl(state, resourceType, al._resourceId, actionProps?.childId)
  );

  if (resourceType === 'integrations' && al?._resourceId === 'none') {
    resourceName = STANDALONE_INTEGRATION.name;
  }

  if (al.event === 'delete') {
    if (!al.deletedInfo) {
      return al._resourceId || '';
    }

    return al.deletedInfo.name;
  }

  return (
    <Link
      onClick={actionProps && actionProps.onClick}
      to={routePath}>
      {resourceName || al._resourceId}
    </Link>
  );
}
