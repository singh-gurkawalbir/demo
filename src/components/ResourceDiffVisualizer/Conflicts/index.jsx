import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { serializeConflicts } from '../utils';

export default function Conflicts({ conflicts }) {
  if (!conflicts || !conflicts.length) return null;

  const serializedConflicts = serializeConflicts(conflicts);

  // Can be enhanced
  return (
    <>
      <h1> Conflicts </h1>
      <ReactDiffViewer
        splitView={false}
        hideLineNumbers
        newValue={JSON.stringify(serializedConflicts, null, 2)}
        />
    </>
  );
}
