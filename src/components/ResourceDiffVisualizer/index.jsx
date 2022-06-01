import React from 'react';
import LoadResources from '../LoadResources';
import ResourceDiffContainer from './ResourceDiffContainer';

const SUPPORTED_RESOURCE_TYPES = [
  'export',
  'import',
  'flow',
  'integration',
  'script',
  'asynchelper',
  'filedefinition',
];

const REQUIRED_RESOURCE_TYPES_TO_LOAD = SUPPORTED_RESOURCE_TYPES.map(type => `${type}s`);

export default function ResourceDiffVisualizer({ diffs = {}, titles, forceExpand, integrationId }) {
  return (
    <LoadResources resources={REQUIRED_RESOURCE_TYPES_TO_LOAD}>
      {
          SUPPORTED_RESOURCE_TYPES.map(resourceType => (
            <ResourceDiffContainer
              key={resourceType}
              resourceType={resourceType}
              integrationId={integrationId}
              diff={diffs[resourceType]}
              forceExpand={forceExpand}
              titles={titles}
            />
          ))
      }
    </LoadResources>
  );
}
