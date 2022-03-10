import React from 'react';
import ResourceDiffContainer from './ResourceDiffContainer';

const SUPPORTED_RESOURCE_TYPES = ['export', 'import', 'flow', 'integration', 'script'];

export default function ResourceDiffVisualizer({ diffs = {}, forceExpand }) {
  if (!Object.keys(diffs).length) return <></>;

  return (
    <>
      {
          SUPPORTED_RESOURCE_TYPES.map(resourceType => (
            <ResourceDiffContainer
              key={resourceType}
              resourceType={resourceType}
              diff={diffs[resourceType]}
              forceExpand={forceExpand}
            />
          ))
      }
    </>
  );
}
