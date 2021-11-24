import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadResources from '../../LoadResources';
import { selectors } from '../../../reducers';

export default function ResourceLink({ name, id, resourceType, onClick }) {
  const routePath = useSelector(state =>
    selectors.getResourceEditUrl(state, resourceType, id)
  );

  const resourceName = name || id;

  if (resourceType === 'asynchelpers') {
    // @Bug: IO-23050 No link to navigate for asyncHelpers. So just display the name
    return resourceName;
  }

  return (
    <LoadResources resources={resourceType}>
      <Link onClick={onClick} to={routePath}>{resourceName}</Link>
    </LoadResources>
  );
}
