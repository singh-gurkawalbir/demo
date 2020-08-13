import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

export default function ErrorLink({ job }) {
  const { _exportId, _importId, numError} = job;
  const match = useRouteMatch();
  const resourceId = _exportId || _importId;
  const { flowId } = match?.params || {};
  const path = `${flowId}/errors/${resourceId}`;

  if (numError > 0) {
    return <Link to={path}> {numError} </Link>;
  }

  return <span> {numError} </span>;
}
