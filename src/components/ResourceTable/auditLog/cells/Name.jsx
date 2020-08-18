import React from 'react';
import { Link } from 'react-router-dom';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../../constants/resource';
import getExistingResourcePagePath from '../../../../utils/resource';

function getResource(resourceType, resourceId, actionProps) {
  const { resourceDetails } = actionProps;
  const resourceTypePlural = RESOURCE_TYPE_SINGULAR_TO_PLURAL[resourceType];
  const resource =
    resourceType &&
    resourceDetails[resourceTypePlural] &&
    resourceDetails[resourceTypePlural][resourceId];

  return resource;
}

export default function NameCell({al, actionProps}) {
  if (al.event === 'delete') {
    return al.deletedInfo.name;
  }

  return (
    <Link
      onClick={actionProps && actionProps.onClick}
      to={getExistingResourcePagePath({
        type: al.resourceType,
        id: al._resourceId,
        _integrationId: (
          getResource(al.resourceType, al._resourceId, actionProps) || {}
        )._integrationId,
      })}>
      {(getResource(al.resourceType, al._resourceId, actionProps) || {})
        .name || `${al._resourceId}`}
    </Link>
  );
}
