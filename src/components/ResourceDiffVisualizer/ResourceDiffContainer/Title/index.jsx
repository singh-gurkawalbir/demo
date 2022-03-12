import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import ActionGroup from '../../../ActionGroup';
import { selectors } from '../../../../reducers';
import CeligoDivider from '../../../CeligoDivider';
import { REVISION_DIFF_ACTION_LABELS, REVISION_DIFF_ACTIONS } from '../../../../utils/revisions';
import ViewReferences from './ViewReferences';
import FullScreen from './FullScreen';

export default function DiffContainerTitle(props) {
  const { resourceId, action = REVISION_DIFF_ACTIONS.UPDATE, resourceType} = props;
  const resourceName = useSelector(state => selectors.resourceName(state, resourceId, resourceType));

  return (
    <>
      <ActionGroup>
        <Typography variant="body2"> {resourceName || resourceId} </Typography>
        <Typography variant="body2"> Action: {REVISION_DIFF_ACTION_LABELS[action]} </Typography>
      </ActionGroup>
      <ActionGroup position="right">
        <ViewReferences />
        <CeligoDivider />
        <FullScreen />
      </ActionGroup>
    </>
  );
}
