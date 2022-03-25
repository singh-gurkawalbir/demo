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
    alignItems: 'center',
  },
  referencesFullscreenAction: {
    '&> :not(:last-child)': {
      marginRight: 0,
    },
    '& .MuiButtonBase-root': {
      padding: 0,
    },
  },
  referencesFullscreenModal: {
    minWidth: '1280px',
    padding: 0,
  },
}));

export function ModalTitle({ resourceId, resourceType, action, integrationId }) {
  const classes = useStyles();
  const resourceName = useSelector(state => selectors.resourceName(state, resourceId, resourceType));
  const showReferences = shouldShowReferences(resourceType);

  return (
    <>
      <div className={classes.title}>
        <Typography variant="body2"> {resourceName || resourceId} </Typography>
        <CeligoDivider />
        <Typography variant="body2"> Action: {REVISION_DIFF_ACTION_LABELS[action]} </Typography>
        {showReferences && (
        <ActionGroup position="right" className={classes.referencesFullscreenAction}>
          <ViewReferences resourceId={resourceId} resourceType={resourceType} integrationId={integrationId} />
          <CeligoDivider />
        </ActionGroup>
        )}
      </div>
    </>
  );
}
export default function FullScreenModal({resourceType, resourceDiff, titles, onClose, integrationId }) {
  const { resourceId, action = REVISION_DIFF_ACTIONS.UPDATE } = resourceDiff;
  const classes = useStyles();

  return (
    <ModalDialog
      show onClose={onClose} maxWidth="lg"
      className={classes.referencesFullscreenModal}>
      <ModalTitle
        resourceId={resourceId} resourceType={resourceType} action={action} integrationId={integrationId} />
      <DiffPanel resourceDiff={resourceDiff} titles={titles} />
    </ModalDialog>
  );
}
