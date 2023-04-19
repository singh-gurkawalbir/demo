import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import CollapsableContainer from '../../CollapsableContainer';
import Title from './Title';
import DiffPanel from './DiffPanel';
import { capitalizeFirstLetter } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  resourceContainer: {
    background: theme.palette.background.paper2,
  },
  resourceTypeWrapper: {
    '& .MuiAccordionDetails-root': {
      borderTop: `1px solid ${theme.palette.secondary.lightest}`,
      padding: 0,
    },
  },
}));

const getResourceTypeTitle = resourceType => `${capitalizeFirstLetter(resourceType)}s`;

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
            title={(
              <Title
                resourceType={getResourceTypeTitle(resourceType).toLocaleLowerCase()}
                resourceDiff={resourceDiff}
                integrationId={integrationId}
                titles={titles}
              />
)}
            key={resourceDiff.resourceId}
            className={classes.resourceTypeWrapper}>
            <DiffPanel resourceDiff={resourceDiff} titles={titles} />
          </CollapsableContainer>
        ))
      }
    </CollapsableContainer>
  );
}
