import React, { useState } from 'react';
import { getResourceLevelChanges } from '../utils';
import ResourceDiffVisualizer from '../ResourceDiffVisualizer';

export default function DiffContent({ jsonDiff }) {
  const [forceExpand, setForceExpand] = useState(false);
  const changes = getResourceLevelChanges(jsonDiff);
  const { diffs } = changes;

  return (
    <>
      <button type="button" onClick={() => setForceExpand(f => !f)}>
        { forceExpand ? 'Collapse' : 'Expand'}
      </button>
      <ResourceDiffVisualizer diffs={diffs} forceExpand={forceExpand} />
    </>
  );
}
