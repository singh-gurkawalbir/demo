import React from 'react';
import ResourceDiffContainer from './ResourceDiffContainer';

const SUPPORTED_RESOURCE_TYPES = ['export', 'import', 'connections', 'flow', 'integration', 'script'];

export default function ResourceDiffVisualizer({ diffs = {}, titles, forceExpand, integrationId }) {
  return (
    <>
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
    </>
  );
}
