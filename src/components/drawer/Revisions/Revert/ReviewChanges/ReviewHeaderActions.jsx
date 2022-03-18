import React from 'react';
import { IconButton } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ActionGroup from '../../../../ActionGroup';
import CeligoDivider from '../../../../CeligoDivider';
import RevisionsGuide from '../../RevisionsGuide';
import ExpandAllResourceDiff from '../../ExpandAllResourceDiff';

const useStyles = makeStyles(() => ({
  drawerHeaderActions: {
    width: '100%',
    display: 'flex',
  },
  expand: {
    minWidth: 110,
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function ReviewHeaderActions({ integrationId, revId }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.revertRequest(integrationId, revId));
  };

  return (
    <>
      <div className={classes.drawerHeaderActions}>
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
