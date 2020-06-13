import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';

export default function ResourceDrawerLink({
  ssLinkedConnectionId,
  resourceType,
  resource,
  disabled = false,
  onClick,
}) {
  const match = useRouteMatch();
  const isEditable = useSelector(
    state => {
      const cp = selectors.resourcePermissions(
        state,
        'connections',
        ssLinkedConnectionId,
      );
      return cp.edit;
    }
  );

  // nothing we can do without both type and resource...
  if (!resourceType || !resource) return null;

  const linkLabel = resource.ioFlowName || resource.name || resource._id || 'unknown';

  // console.log(match);

  if (!isEditable || disabled) return linkLabel;

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
        to={`${match.url}/edit/${resourceType}/${resource._id}`}>
        {linkLabel}
      </Link>
    </>
  );
}
