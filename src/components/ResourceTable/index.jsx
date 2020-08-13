import React from 'react';
import metadata from './metadata';
import CeligoTable from '../CeligoTable';

const noResources = [];

export default function ResourceTable({
  resourceType,
  resources = noResources,
  actionProps,
  ...rest
}) {
  return (
    <CeligoTable
      data={resources}
      filterKey={resourceType}
      {...metadata(resourceType)}
      {...rest}
      actionProps={{ ...actionProps, resourceType }}
    />
  );
}
