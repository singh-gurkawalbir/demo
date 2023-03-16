import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Typography } from '@mui/material';
import { InfoIconButton } from '@celigo/fuse-ui';
import { drawerPaths, buildDrawerUrl } from '../../utils/rightDrawer';

export default function ResourceDrawerLink({
  resourceType,
  resource,
  disabled = false,
  onClick,
}) {
  const match = useRouteMatch();

  // nothing we can do without both type and resource...
  if (!resourceType || !resource) return null;

  const linkLabel =
    resourceType === 'connectorLicenses'
      ? resource.user && resource.user.email
      : resource.name || resource._id || 'unknown';

  // console.log(match);

  if (disabled) return linkLabel;

  return (
    <>
      <Link
        onClick={onClick}
        // if a user clicks to open a resource drawer (when the drawer is already opened),
        // we should replace the top of the history stack
        // so the back button does not need to traverse over
        // all resources a user clicked on. This logic may change, but I think
        // is better for UX and a good starting position to take.
        // We "know (guess) that a drawer is already opened if the route path is not
        // an exact match (url already contains drawer route segment)"
        replace={!match.isExact}
        to={buildDrawerUrl({
          path: drawerPaths.RESOURCE.EDIT,
          baseUrl: match.url,
          params: { resourceType, id: resource._id },
        })}
      >
        {linkLabel}
      </Link>
      {resource.description && (
        <InfoIconButton
          info={resource.description}
          escapeUnsecuredDomains
          size="xs"
          title={linkLabel}
        />
      )}
      {resource.shared && <Typography>Shared</Typography>}
    </>
  );
}
