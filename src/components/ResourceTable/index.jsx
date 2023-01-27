import React from 'react';
import rfdc from 'rfdc';
import metadata from './metadata';
import CeligoTable from '../CeligoTable';

const clone = rfdc({proto: true});

const noResources = [];

export default function ResourceTable({
  resourceType,
  resources = noResources,
  actionProps,
  ...rest
}) {
  return (
    <CeligoTable
      data={clone(resources)}
      filterKey={resourceType}
      {...metadata(resourceType)}
      {...rest}
      actionProps={{ ...actionProps, resourceType }}
    />
  );
}
