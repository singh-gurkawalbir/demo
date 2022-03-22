import React from 'react';
import ConflictsDiffViewer from '../ConflictsDiffViewer';
// import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
// import { serializeConflicts, fetchConflictsOnBothBases } from '../utils';

export default function Conflicts({ conflicts }) {
  if (!conflicts || !conflicts.length) return null;

  // const { ours, theirs } = fetchConflictsOnBothBases(conflicts);

  return (
    <>
      <h1> Conflicts </h1>
      {/* <ReactDiffViewer
        hideLineNumbers
        compareMethod={DiffMethod.WORDS}
        leftTitle="Ours"
        rightTitle="Theirs"
        oldValue={JSON.stringify(serializeConflicts(ours), null, 2)}
        newValue={JSON.stringify(serializeConflicts(theirs), null, 2)}
        /> */}
      <ConflictsDiffViewer
        leftTitle="Current"
        rightTitle="Remote"
       />
    </>
  );
}
