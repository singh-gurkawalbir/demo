import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadResources from '../../LoadResources';
import * as selectors from '../../../reducers';

export default function ResourceLink({ name, id, resourceType, onClick }) {
  const routePath = useSelector(state =>
    selectors.getResourceEditUrl(state, resourceType, id)
  );

  return (
    <LoadResources resources={resourceType}>
      <Link onClick={onClick} to={routePath}>{name || id}</Link>
    </LoadResources>
  );
}
