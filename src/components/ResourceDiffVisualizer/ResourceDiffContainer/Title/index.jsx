import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ActionGroup from '../../../ActionGroup';
import { selectors } from '../../../../reducers';
import CeligoDivider from '../../../CeligoDivider';
import { REVISION_DIFF_ACTION_LABELS, REVISION_DIFF_ACTIONS, shouldShowReferences } from '../../../../utils/revisions';
import ViewReferences from './ViewReferences';
import FullScreen from './FullScreen';
import ConflictStatus from '../../ConflictStatus';

const useStyles = makeStyles(theme => ({
  referencesButton: {
    '&> :not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function DiffContainerTitle({ resourceDiff, resourceType, integrationId, titles }) {
  const { resourceId, action = REVISION_DIFF_ACTIONS.UPDATE } = resourceDiff;
  const classes = useStyles();
  const resourceName = useSelector(state => selectors.diffResourceName(state, {
    resourceId,
    resourceType,
    resourceDiff,
  }));
  const showReferences = shouldShowReferences(resourceType, action);
  const numConflicts = resourceDiff?.conflicts?.length;

  return (
    <>
      <ActionGroup>
        <Typography variant="body2"> {resourceName} </Typography>
        <CeligoDivider />
        <Typography variant="body2"> Action: {REVISION_DIFF_ACTION_LABELS[action]} </Typography>
        { numConflicts && <ConflictStatus count={numConflicts} />}
      </ActionGroup>
      <ActionGroup position="right" className={classes.referencesButton}>
        { showReferences && <ViewReferences integrationId={integrationId} resourceId={resourceId} resourceType={resourceType} />}
        { showReferences && <CeligoDivider position="right" /> }
        <FullScreen
          resourceDiff={resourceDiff}
          titles={titles}
          resourceType={resourceType}
          integrationId={integrationId} />
      </ActionGroup>
    </>
  );
}
