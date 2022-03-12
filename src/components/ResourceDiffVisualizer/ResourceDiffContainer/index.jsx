import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import CollapsableContainer from '../CollapsableContainer';
import Conflicts from '../Conflicts';
import Title from './Title';

const useStyles = makeStyles(() => ({
  resourceContainer: {
    background: '#F0F5F9',
  },
}));

const getResourceTypeTitle = resourceType => `${resourceType[0].toUpperCase()}${resourceType.slice(1)}s`;

export default function ResourceDiffContainer({ diff, resourceType, forceExpand }) {
  const classes = useStyles();
  const getValues = res => {
    if (resourceType === 'script') {
      return { oldValue: res.before, newValue: res.after};
    }

    return {
      oldValue: JSON.stringify(res.before, null, 2),
      newValue: JSON.stringify(res.after, null, 2),
    };
  };

  const codeFoldMessageRenderer = p1 => `(Our custom code with styles) Expand ${p1} lines...`;

  return (
    <CollapsableContainer
      className={classes.resourceContainer}
      title={getResourceTypeTitle(resourceType)}
      forceExpand={forceExpand}
    >
      {
        diff?.map(res => (
          <CollapsableContainer
            forceExpand={forceExpand}
            title={<Title resourceId={res.resourceId} resourceType={getResourceTypeTitle(resourceType).toLocaleLowerCase()} action={res.action} />}
            key={res.resourceId}
           >
            <ReactDiffViewer
              codeFoldMessageRenderer={codeFoldMessageRenderer}
              compareMethod={DiffMethod.WORDS}
              {...getValues(res)}
            />
            <Conflicts conflicts={res.conflicts} />
          </CollapsableContainer>
        ))
      }
    </CollapsableContainer>
  );
}
