import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ActionGroup from '../../../../ActionGroup';
import ModalDialog from '../../../../ModalDialog';
import DiffPanel from '../../DiffPanel';
import ViewReferences from '../ViewReferences';
import CeligoDivider from '../../../../CeligoDivider';
import { selectors } from '../../../../../reducers';
import { REVISION_DIFF_ACTION_LABELS, REVISION_DIFF_ACTIONS, shouldShowReferences } from '../../../../../utils/revisions';

const useStyles = makeStyles(() => ({
  title: {
    display: 'flex',
    wordBreak: 'normal !important',
  },
}));

export function ModalTitle({ resourceId, resourceType, action, integrationId }) {
  const classes = useStyles();
  const resourceName = useSelector(state => selectors.resourceName(state, resourceId, resourceType));
  const showReferences = shouldShowReferences(resourceType);

  return (
    <>
      <div className={classes.title}>
        <Typography variant="body2" className> {resourceName || resourceId} </Typography>
        <CeligoDivider />
        <Typography variant="body2"> Action: {REVISION_DIFF_ACTION_LABELS[action]} </Typography>
        {showReferences && (
        <ActionGroup position="right">
          <ViewReferences resourceId={resourceId} resourceType={resourceType} integrationId={integrationId} />
          <CeligoDivider />
        </ActionGroup>
        )}
      </div>
    </>
  );
}
export default function FullScreenModal({resourceType, resourceDiff, onClose, integrationId }) {
  const { resourceId, action = REVISION_DIFF_ACTIONS.UPDATE } = resourceDiff;

  return (
    <ModalDialog show onClose={onClose} maxWidth="xl" minWidth="md">
      <ModalTitle resourceId={resourceId} resourceType={resourceType} action={action} integrationId={integrationId} />
      <DiffPanel resourceDiff={resourceDiff} />
    </ModalDialog>
  );
}
