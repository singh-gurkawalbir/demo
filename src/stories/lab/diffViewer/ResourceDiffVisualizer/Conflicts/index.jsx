import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';

export default function Conflicts({ conflicts }) {
  if (!conflicts || !conflicts.length) return null;

  // Can be enhanced
  return (
    <>
      <h1> Conflicts </h1>
      <ReactDiffViewer
        splitView={false}
        hideLineNumbers
        newValue={JSON.stringify(conflicts, null, 2)}
        />
    </>
  );
}
