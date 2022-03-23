import React from 'react';
import { useTheme } from '@material-ui/core';

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
  const theme = useTheme();
  const newStyles = {
    titleBlock: {
      backgroundColor: theme.palette.background.default,
      borderBottom: 'none',
      padding: '8px',
      '& pre': {
        lineHeight: 1,
      },
      '&:last-child': {
        borderLeft: `1px solid ${theme.palette.secondary.lightest} `,
      },
    },
    contentText: {
      fontFamily: 'source sans pro semibold',
      color: theme.palette.secondary.light,
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
