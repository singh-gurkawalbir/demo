import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import CollapsableContainer from '../CollapsableContainer';
import { getResourceLevelChanges } from '../utils';
import Conflicts from '../Conflicts';

export default function DiffContent({ jsonDiff }) {
  const changes = getResourceLevelChanges(jsonDiff);
  const { diffs } = changes;

  return (
    <>
      <CollapsableContainer title="Exports">
        {
              diffs.export?.map(exp => (
                <CollapsableContainer title={`${exp.resourceId} : Action - ${exp.action || 'Update'}`} key={exp.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(exp.before && exp.after)}
                    hideLineNumbers={!(exp.before && exp.after)}
                    oldValue={exp.before && JSON.stringify(exp.before, null, 2)}
                    newValue={exp.after && JSON.stringify(exp.after, null, 2)}
                  />
                  <Conflicts conflicts={exp.conflicts} />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
      <CollapsableContainer title="Imports">
        {
              diffs.import?.map(imp => (
                <CollapsableContainer title={`${imp.resourceId} : Action - ${imp.action || 'Update'}`} key={imp.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(imp.before && imp.after)}
                    hideLineNumbers={!(imp.before && imp.after)}
                    oldValue={imp.before && JSON.stringify(imp.before, null, 2)}
                    newValue={imp.after && JSON.stringify(imp.after, null, 2)}
                  />
                  <Conflicts conflicts={imp.conflicts} />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
      <CollapsableContainer title="Scripts">
        {
              diffs.script?.map(script => (
                <CollapsableContainer title={`${script.resourceId} : Action - ${script.action || 'Update'}`} key={script.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(script.before && script.after)}
                    hideLineNumbers={!(script.before && script.after)}
                    oldValue={script.before}
                    newValue={script.after}
                  />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
      <CollapsableContainer title="Connections">
        {
              diffs.connection?.map(con => (
                <CollapsableContainer title={`${con.resourceId} : Action - ${con.action || 'Update'}`} key={con.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(con.before && con.after)}
                    hideLineNumbers={!(con.before && con.after)}
                    oldValue={con.before && JSON.stringify(con.before, null, 2)}
                    newValue={con.after && JSON.stringify(con.after, null, 2)}
                  />
                  <Conflicts conflicts={con.conflicts} />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
      <CollapsableContainer title="Integrations">
        {
              diffs.integration?.map(int => (
                <CollapsableContainer title={`${int.resourceId} : Action - ${int.action || 'Update'}`} key={int.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(int.before && int.after)}
                    hideLineNumbers={!(int.before && int.after)}
                    oldValue={int.before && JSON.stringify(int.before, null, 2)}
                    newValue={int.after && JSON.stringify(int.after, null, 2)}
                  />
                  <Conflicts conflicts={int.conflicts} />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
      <CollapsableContainer title="Flows">
        {
              diffs.flow?.map(flow => (
                <CollapsableContainer title={`${flow.resourceId} : Action - ${flow.action || 'Update'}`} key={flow.resourceId}>
                  <ReactDiffViewer
                    splitView={!!(flow.before && flow.after)}
                    hideLineNumbers={!(flow.before && flow.after)}
                    oldValue={flow.before && JSON.stringify(flow.before, null, 2)}
                    newValue={flow.after && JSON.stringify(flow.after, null, 2)}
                  />
                  <Conflicts conflicts={flow.conflicts} />
                </CollapsableContainer>
              ))
            }
      </CollapsableContainer>
    </>
  );
}
