import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';

export default function ErrorDetailsTitle() {
  const match = useRouteMatch();
  const { resourceId } = match?.params || {};
  const resourceName = useSelector(state => {
    if (!resourceId) return;
    const exportObj = selectors.resource(state, 'exports', resourceId);

    if (exportObj?.name) return exportObj.name;

    return selectors.resource(state, 'imports', resourceId)?.name;
  });

  if (!match) return null;

  return <span> Errors: {resourceName} </span>;
}
