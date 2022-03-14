import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CollapsableContainer from '../CollapsableContainer';
import Title from './Title';
import DiffPanel from './DiffPanel';

const useStyles = makeStyles(() => ({
  resourceContainer: {
    background: '#F0F5F9',
  },
}));

const getResourceTypeTitle = resourceType => `${resourceType[0].toUpperCase()}${resourceType.slice(1)}s`;

export default function ResourceDiffContainer({ diff, resourceType, forceExpand, integrationId }) {
  const classes = useStyles();

  return (
    <CollapsableContainer
      className={classes.resourceContainer}
      title={getResourceTypeTitle(resourceType)}
      forceExpand={forceExpand}
    >
      {
        diff?.map(resourceDiff => (
          <CollapsableContainer
            forceExpand={forceExpand}
            title={<Title resourceType={getResourceTypeTitle(resourceType).toLocaleLowerCase()} resourceDiff={resourceDiff} integrationId={integrationId} />}
            key={resourceDiff.resourceId}
            >
            <DiffPanel resourceDiff={resourceDiff} />
          </CollapsableContainer>
        ))
      }
    </CollapsableContainer>
  );
}
