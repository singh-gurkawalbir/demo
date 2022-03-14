import React from 'react';
import { IconButton } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from '../../../../icons/RefreshIcon';
import ExpandWindowIcon from '../../../../icons/ExpandWindowIcon';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ActionGroup from '../../../../ActionGroup';
import CeligoDivider from '../../../../CeligoDivider';
import RevisionsGuide from '../../RevisionsGuide';

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
  const isDiffExpanded = useSelector(state => selectors.isDiffExpanded(state, integrationId));
  const isResourceComparisonInProgress = useSelector(state => selectors.isResourceComparisonInProgress(state, integrationId));

  const handleRefresh = () => {
    dispatch(actions.integrationLCM.compare.revertRequest(integrationId, revId));
  };

  const handleToggleExpand = () => {
    dispatch(actions.integrationLCM.compare.toggleExpandAll(integrationId));
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
          <div className={classes.expand}>
            <IconButton
              size="small"
              data-test="expandAll"
              onClick={handleToggleExpand}>
              <ExpandWindowIcon />
            </IconButton>
            {isDiffExpanded ? 'Collapse all' : 'Expand all'}
          </div>
          <RevisionsGuide />
        </ActionGroup>
      </div>
    </>
  );
}
