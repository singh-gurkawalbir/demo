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

const DEFAULT_DIFF_TITLES = { before: 'Before changes', after: 'After changes'};

export default function DiffPanel({ resourceDiff, titles = {} }) {
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
        leftTitle={titles.before || DEFAULT_DIFF_TITLES.before}
        rightTitle={titles.after || DEFAULT_DIFF_TITLES.after}
        styles={newStyles} />
      <Conflicts conflicts={resourceDiff.conflicts} />
    </>
  );
}
