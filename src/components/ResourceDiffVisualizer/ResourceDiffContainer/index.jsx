import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CollapsableContainer from '../CollapsableContainer';
import Title from './Title';
import DiffPanel from './DiffPanel';

const useStyles = makeStyles(theme => ({
  resourceContainer: {
    background: '#F0F5F9',
  },
  resourceTypeWrapper: {
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
      padding: 0,
    },
  },
}));

const getResourceTypeTitle = resourceType => `${resourceType[0].toUpperCase()}${resourceType.slice(1)}s`;

export default function ResourceDiffContainer({ diff, titles, resourceType, forceExpand, integrationId }) {
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
            className={classes.resourceTypeWrapper}>
            <DiffPanel resourceDiff={resourceDiff} titles={titles} />
          </CollapsableContainer>
        ))
      }
    </CollapsableContainer>
  );
}
