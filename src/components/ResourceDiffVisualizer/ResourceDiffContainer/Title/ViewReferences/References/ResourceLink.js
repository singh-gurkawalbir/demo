import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectors } from '../../../../../../reducers';

export default function ResourceLink({ name, id, resourceType, onClick }) {
  const routePath = useSelector(state =>
    selectors.getResourceEditUrl(state, resourceType, id)
  );

  const resourceName = name || id;

  return (
    <Link onClick={onClick} to={routePath}>{resourceName}</Link>
  );
}
