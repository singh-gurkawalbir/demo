import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../icons/RefreshIcon';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { REVISION_TYPES } from '../../../../utils/constants';
import ActionGroup from '../../../ActionGroup';
import CeligoDivider from '../../../CeligoDivider';
import RevisionsGuide from '../RevisionsGuide';
import useCancelRevision from '../hooks/useCancelRevision';
import ExpandAllResourceDiff from '../ExpandAllResourceDiff';
import ConflictStatus from '../../../ResourceDiffVisualizer/ConflictStatus';
import { REVISION_DRAWER_MODES } from '../../../../utils/revisions';
import CancelIcon from '../../../icons/CancelIcon';

const useStyles = makeStyles(theme => ({
  drawerHeaderActions: {
    width: '100%',
    display: 'flex',
    '&:not(:last-child)': {
      marginRight: 0,
    },
  },
  container: {
    width: theme.spacing(11),
  },
  icon: {
    marginRight: theme.spacing(0.5),
  },
}));

const Conflicts = ({ integrationId, mode }) => {
  const hasReceivedResourceDiff = useSelector(state => selectors.hasReceivedResourceDiff(state, integrationId));
  const numConflicts = useSelector(state => selectors.revisionResourceDiff(state, integrationId)?.numConflicts);

  if (mode === REVISION_DRAWER_MODES.REVIEW && hasReceivedResourceDiff) {
    return <ConflictStatus count={numConflicts} />;
  }

  return null;
};

const RefreshResourceChanges = ({ integrationId, revisionId, mode }) => {
  const dispatch = useDispatch();
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));
  const tempRevisionType = useSelector(state => selectors.tempRevisionType(state, integrationId, revisionId));
  const handleRefresh = () => {
    if (tempRevisionType === REVISION_TYPES.PULL) {
      dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revisionId));
    } else {
      dispatch(actions.integrationLCM.compare.revertRequest(integrationId, revisionId));
    }
  };

  if (
    mode !== REVISION_DRAWER_MODES.REVIEW ||
      ![REVISION_TYPES.PULL, REVISION_TYPES.REVERT].includes(tempRevisionType)
  ) {
    return null;
  }

  return (
    <>
      <IconButton
        disabled={isResourceComparisonInProgress}
        size="small"
        data-test="expandAll"
        onClick={handleRefresh}>
        <RefreshIcon />
      </IconButton>
      <CeligoDivider />
    </>
  );
};

const ExpandAction = ({ integrationId, mode}) => {
  if (mode === REVISION_DRAWER_MODES.REVIEW) {
    return <ExpandAllResourceDiff integrationId={integrationId} />;
  }

  return null;
};

const CancelRevision = ({ integrationId, revisionId, mode, onClose }) => {
  const classes = useStyles();
  const handleCancel = useCancelRevision({ integrationId, revisionId, onClose });

  if (mode !== REVISION_DRAWER_MODES.MERGE) {
    return null;
  }

  return (
    <IconButton
      size="small"
      className={classes.container}
      data-test="expandAll"
      onClick={handleCancel}>
      <CancelIcon className={classes.icon} />
      <Typography variant="body2"> Cancel merge</Typography>
    </IconButton>
  );
};

export default function ReviewHeaderActions({ integrationId, revId, mode, onClose }) {
  const classes = useStyles();

  return (
    <div className={classes.drawerHeaderActions}>
      <Conflicts integrationId={integrationId} mode={mode} />
      <ActionGroup position="right">
        <RefreshResourceChanges integrationId={integrationId} revisionId={revId} mode={mode} />
        <ExpandAction integrationId={integrationId} mode={mode} />
        <RevisionsGuide />
        <CancelRevision integrationId={integrationId} revisionId={revId} mode={mode} onClose={onClose} />
        <CeligoDivider />
      </ActionGroup>
    </div>
  );
}
