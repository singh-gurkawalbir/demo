import React from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import Conflicts from '../../Conflicts';

const getDiffValues = (diff, resourceType) => {
  if (resourceType === 'script') {
    return { oldValue: diff.before, newValue: diff.after};
  }

  return {
    oldValue: JSON.stringify(diff.before, null, 2),
    newValue: JSON.stringify(diff.after, null, 2),
  };
};

export default function DiffPanel({ resourceDiff }) {
  // const codeFoldMessageRenderer = p1 => `(Our custom code with styles) Expand ${p1} lines...`;

  return (
    <>
      <ReactDiffViewer
        // codeFoldMessageRenderer={codeFoldMessageRenderer}
        compareMethod={DiffMethod.WORDS}
        {...getDiffValues(resourceDiff)}
      />
      <Conflicts conflicts={resourceDiff.conflicts} />
    </>
  );
}
