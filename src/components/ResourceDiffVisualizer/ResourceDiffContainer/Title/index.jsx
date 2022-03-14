import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import ActionGroup from '../../../ActionGroup';
import { selectors } from '../../../../reducers';
import CeligoDivider from '../../../CeligoDivider';
import { REVISION_DIFF_ACTION_LABELS, REVISION_DIFF_ACTIONS, shouldShowReferences } from '../../../../utils/revisions';
import ViewReferences from './ViewReferences';
import FullScreen from './FullScreen';

export default function DiffContainerTitle({ resourceDiff, resourceType, integrationId }) {
  const { resourceId, action = REVISION_DIFF_ACTIONS.UPDATE } = resourceDiff;

  const resourceName = useSelector(state => selectors.resourceName(state, resourceId, resourceType));
  const showReferences = shouldShowReferences(resourceType);

  return (
    <>
      <ActionGroup>
        <Typography variant="body2"> {resourceName || resourceId} </Typography>
        <Typography variant="body2"> Action: {REVISION_DIFF_ACTION_LABELS[action]} </Typography>
      </ActionGroup>
      <ActionGroup position="right">
        { showReferences && <ViewReferences integrationId={integrationId} resourceId={resourceId} resourceType={resourceType} />}
        { showReferences && <CeligoDivider /> }
        <FullScreen resourceDiff={resourceDiff} resourceType={resourceType} integrationId={integrationId} />
      </ActionGroup>
    </>
  );
}
