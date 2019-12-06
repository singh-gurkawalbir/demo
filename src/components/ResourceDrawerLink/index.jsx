import { Fragment } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Typography } from '@material-ui/core';

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
    <Fragment>
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
        to={`${match.url}/edit/${resourceType}/${resource._id}`}>
        {linkLabel}
      </Link>
      {resource.shared && <Typography>Shared</Typography>}
    </Fragment>
  );
}
