import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ActionGroup from '../../../../ActionGroup';
import CeligoDivider from '../../../../CeligoDivider';
import RevisionsGuide from '../../RevisionsGuide';
import ExpandAllResourceDiff from '../../ExpandAllResourceDiff';
import ConflictStatus from '../../../../ResourceDiffVisualizer/ConflictStatus';

const useStyles = makeStyles(() => ({
  drawerHeaderActions: {
    width: '100%',
    display: 'flex',
  },
}));

export default function ReviewHeaderActions({ numConflicts, integrationId, revId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.pullRequest(integrationId, revId));
  };

  return (
    <>
      <div className={classes.drawerHeaderActions}>
        { !isResourceComparisonInProgress && <ConflictStatus count={numConflicts} /> }
        <ActionGroup position="right">
          <IconButton
            disabled={isResourceComparisonInProgress}
            size="small"
            data-test="expandAll"
            onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
          <CeligoDivider />
          <ExpandAllResourceDiff integrationId={integrationId} />
          <RevisionsGuide />
        </ActionGroup>
      </div>
    </>
  );
}
