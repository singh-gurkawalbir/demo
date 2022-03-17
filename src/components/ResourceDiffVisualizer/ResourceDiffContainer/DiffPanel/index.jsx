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
  const newStyles = {
    titleBlock: {
      backgroundColor: '#F8FAFF',
      borderBottom: 'none',
      padding: '8px',
      '& pre': {
        lineHeight: 1,
      },
      '&:last-child': {
        borderLeft: '1px solid #D6E4ED',
      },
    },
    contentText: {
      fontFamily: 'source sans pro semibold',
      color: '#677A89',
    },
  };

  return (
    <>
      <ReactDiffViewer
        // codeFoldMessageRenderer={codeFoldMessageRenderer}
        compareMethod={DiffMethod.WORDS}
        {...getDiffValues(resourceDiff)}
        leftTitle="Before pull"
        rightTitle="After pull"
        styles={newStyles} />
      <Conflicts conflicts={resourceDiff.conflicts} />
    </>
  );
}
