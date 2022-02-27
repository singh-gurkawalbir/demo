import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import CollapsableContainer from '../../CollapsableContainer';
import Conflicts from '../../Conflicts';

const getResourceTypeTitle = resourceType => `${resourceType[0].toUpperCase()}${resourceType.slice(1)}s`;

export default function ResourceDiffContainer({ diff, resourceType, forceExpand }) {
  const getValues = res => {
    if (resourceType === 'script') {
      return { oldValue: res.before, newValue: res.after};
    }

    return {
      oldValue: res.before && JSON.stringify(res.before, null, 2),
      newValue: res.after && JSON.stringify(res.after, null, 2),
    };
  };

  return (
    <CollapsableContainer title={getResourceTypeTitle(resourceType)} forceExpand={forceExpand}>
      {
                diff?.map(res => (
                  <CollapsableContainer forceExpand={forceExpand} title={`${res.resourceId} : Action - ${res.action || 'Update'}`} key={res.resourceId}>
                    <ReactDiffViewer
                      splitView={!!(res.before && res.after)}
                      hideLineNumbers={!(res.before && res.after)}
                      {...getValues(res)}
                    />
                    <Conflicts conflicts={res.conflicts} />
                  </CollapsableContainer>
                ))
              }
    </CollapsableContainer>
  );
}
